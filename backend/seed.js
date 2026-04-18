const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Vaccine = require('./src/models/Vaccine');
const Hospital = require('./src/models/Hospital');

const dataDir = path.join(__dirname, 'data');
const hospitalDataPath = path.join(dataDir, 'hospitals.json');
const vaccineDataPath = path.join(dataDir, 'vaccines.json');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const importSeedData = async () => {
  await connectDB();

  const hospitals = fs.existsSync(hospitalDataPath) ? readJson(hospitalDataPath) : [];
  const vaccines = fs.existsSync(vaccineDataPath) ? readJson(vaccineDataPath) : [];

  if (!hospitals.length) {
    console.error('No hospitals data found in', hospitalDataPath);
    process.exit(1);
  }

  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
      dateOfBirth: new Date('1990-01-15'),
      isEmailVerified: true,
    });
  } else {
    // Update existing admin with new credentials
    adminUser.password = 'admin123';
    await adminUser.save();
  }

  console.log(`Using admin user ${adminUser.email}`);

  console.log('Clearing existing vaccine and hospital data...');
  await Vaccine.deleteMany();
  await Hospital.deleteMany();

  const vaccineIdMap = new Map();

  if (vaccines.length) {
    const vaccineDocs = await Promise.all(
      vaccines.map((item) =>
        Vaccine.create({
          name: item.name,
          manufacturer: item.manufacturer || 'Unknown',
          description: item.description || '',
          recommendedDoses: item.dosesRequired || 1,
          minAge: 0,
          maxAge: 120,
          gapBetweenDoses: 28,
        })
      )
    );

    vaccineDocs.forEach((doc, index) => {
      vaccineIdMap.set(vaccines[index]._id, doc._id);
    });
  }

  const unmatchedVaccineIds = new Set();
  hospitals.forEach((hospital) => hospital.vaccines.forEach((vacId) => unmatchedVaccineIds.add(vacId)));
  const placeholderVaccineSaves = [];
  for (const externalId of unmatchedVaccineIds) {
    if (!vaccineIdMap.has(externalId)) {
      const newVaccine = new Vaccine({
        name: `Imported ${externalId}`,
        manufacturer: 'Seeded Data',
        description: `Placeholder for vaccine ${externalId}`,
        recommendedDoses: 1,
        minAge: 0,
        maxAge: 120,
        gapBetweenDoses: 0,
      });
      vaccineIdMap.set(externalId, newVaccine._id);
      placeholderVaccineSaves.push(newVaccine.save());
    }
  }
  await Promise.all(placeholderVaccineSaves);

  const createPlaceholderEmail = (name, suffix) => {
    return `${normalizeName(name)}${suffix}@hospital.local`;
  };

  const hospitalDocs = hospitals.map((hospital, index) => {
    const email = createPlaceholderEmail(hospital.name.substring(0, 20), index + 1);
    const phone = `9000000${String(1000 + index).slice(-4)}`;
    const facilityDefaults = ['Emergency care', 'Pharmacy', 'Diagnostic lab', 'Free parking'];

    const vaccineEntries = hospital.vaccines.map((externalVaccineId) => ({
      vaccineId: vaccineIdMap.get(externalVaccineId),
      price: 150,
      dailySlots: hospital.dailySlots.map((slot) => ({
        date: new Date(slot.date),
        total: slot.total,
        booked: slot.booked,
      })),
    }));

    return {
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      pincode: hospital.pincode,
      state: hospital.state,
      location: {
        type: hospital.location?.type === 'Point' ? 'Point' : 'Point',
        coordinates: hospital.location?.coordinates || [0, 0],
      },
      phone,
      email,
      operatingHours: {
        open: '08:00',
        close: '20:00',
      },
      facilities: facilityDefaults,
      images: [],
      createdBy: adminUser._id,
      vaccines: vaccineEntries,
      isActive: true,
    };
  });

  console.log(`Importing ${hospitalDocs.length} hospitals...`);
  await Hospital.insertMany(hospitalDocs);

  console.log('Seed import complete.');
  process.exit(0);
};

importSeedData().catch((error) => {
  console.error('Seed import failed:', error);
  process.exit(1);
});
