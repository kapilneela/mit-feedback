const fs = require('fs');
const path = require('path');

// Read the prompt CSV lines directly
const rawCoursesCsv = `CourseCode,Course Name,Credits
EMT11011,Linear Algebra and Differential Calculus,3
CHM10011,Engineering Chemistry,3
PHY10010,Engineering Physics,3
MEC10021,Engineering Graphics,3
MEC10010,Ideas and Innovations in Manufacturing,1
CSE10040,Python Programming,2
UNC10030,Environment and Sustainability,1
YOG10010,Yoga - I,1
UNC10060,Financial Literacy,1
UNC10080,Indian Constitution,1
UNC10100,Sports,1
CDC10010,Ability Enhancement Course,0
CIV10010,Engineering Mechanics,3
CSE10010,Foundations of Programming,4
EMT11140,Discrete Mathematics with Graph Theory,3
CSE10020,Foundations of Computer Architecture and System Design,4
YOG10020,Yoga - II,1
UNC10070,Co-Creation,1
UNC10090,Indian Knowledge System,2
PCE10010,Foundations of Peace,2
CSF10010,Foundations of Programming,4
CSF10020,Foundations of Computer Architecture and System Design,4
CSE10120,Programming and Problem Solving,3
ECE10070,Basics of Electrical and Electronics Engineering,4
ECE10030,Python Programming,1
EMT11111,Integral Calculus,3
ECE10050,Digital Electronics,4
UNC10160,AI for everyone,2
ESV10010,Introduction to Electronics & Semiconductor Technology,4
ESV10020,Digital Electronics and Logic Design,4
ESV10030,Computer System Architecture,3
ECE20190,Electronic Devices and Circuits,4
ERE10010,Electrical Fundamentals for Energy Systems,4
PHY10030,Physics for Energy Systems,3
MEC10040,Engineering Mechanics for Energy Systems,4
ECE20370,Analog and Digital Electronics,4
ERE10030,Materials for Energy Systems,4
ECE10010,Basics of Electrical and Electronics Engineering,3
MEC10030,Computer Aided Modelling,2
MRA10010,Python Programming,1
ECE10060,Introduction to Electrical and Electronics Engineering,3
CHM10021,Physical Chemistry,3
CHE20250,Introduction to Chemical Engineering Practices,3
MSE20010,Introduction to Materials Science and Engineering,3
EMT00010,Introductory Mathematics for Bioengineers,0
EMT11150,Mathematics for Bioengineers-I,3
BIE20010,Cell and Molecular Biology,3
BIE20020,Human Anatomy and Physiology,2
PET10010,Petroleum Engineering Practices,3
CIV10041,Engineering Mechanics,4
CIV10020,Surveying Field Practices,2
CIV11020,Surveying Field Practices,2`;

const courses = rawCoursesCsv.trim().split('\n').slice(1).map((line, idx) => {
  const parts = line.split(',');
  return {
    id: `course-${idx + 1}`,
    code: parts[0]?.trim(),
    name: parts[1]?.trim()?.replace(/^"|"$/g, ''),
    credits: parseInt(parts[2]?.trim() || '3')
  };
}).filter(c => c.code && c.name);

// All 32 Divisions list exactly matching MIT-WPU FY structure:
const ALL_32_DIVISIONS = [
  '1 - FY CSE',
  '2 - FY CSE',
  '3 - FY CSE',
  '4 - FY CSE',
  '5 - FY CSE',
  '6 - FY CSE',
  '7 - FY CSE',
  '8 - FY CSE AIDS',
  '9 - FY CSE AIDS',
  '10 - FY CSE AIDS',
  '11 - FY CSE AIDS',
  '12 - FY CSE AIDS',
  '13 - FY CSE CSF',
  '14 - FY CSE CLOUD',
  '15 - FY ECE',
  '16 - FY ECE',
  '17 - FY ECE AIML',
  '18 - FY ECE AIML',
  '19 - FY E&CE',
  '20 - FY SEM VLSI',
  '21 - FY REN ENE',
  '22 - FY MECH',
  '23 - FY MECH',
  '24 - FY MECH ROBO',
  '25 - FY MECH ROBO',
  '26 - FY CHEM',
  '27 - FY MSE',
  '28 - FY PETRO',
  '29 - FY CIVIL',
  '30 - FY CIVIL SMART',
  '31 - FY BIO',
  '32 - FY BIO'
];

console.log('Courses count:', courses.length);
console.log('Divisions count:', ALL_32_DIVISIONS.length);
