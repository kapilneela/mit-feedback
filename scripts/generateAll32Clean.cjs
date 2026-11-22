const fs = require('fs');
const path = require('path');

// 1. Load parsedRaw.json
const parsed = require('./parsedRaw.json');

// Extra students for div 16 and 18 from prompt
const extraCsv16and18 = `1262262221,Akarsh Ashish Chaturvedi,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262260351,Arjun Rajesh Nair,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261651,Aryan Gautam Karajkhede,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261286,Indraneel Amit Shelar,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262260354,Jay Chetanbhai Datta,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262262256,Krushna Pratap Jawale,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262262516,Kush Virendra Hanamsheth,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261766,Lakshya Mehta,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261329,Manas Madhav Oza,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261127,Melvin Cherian,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261376,Neil Vijay Varghese,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262262553,Om Nagesh Pawar,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262262501,Parth Rakesh Vaidya,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262262316,Pradyun Rege,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261422,Pritish Nitin Mudgal,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262260673,Savani Sameer Kulkarni,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261468,Shivanjali Mahadev Powar,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261608,Spandan Rushikesh Chaudhari,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261882,Tirth Tejas Chovatia,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261692,Vanshika Pandurang Yesade,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261151,Viraj Vilas Gaikwad,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262261777,Zayaan Ghazali Syed,B.Tech Electronics and Communication Engineering,16 - FY ECE,1
1262262297,Aashvi Pushpak,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262262508,Abhishek Prasad Upadhye,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262261676,Aneesh Milind Vyawahare,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262262534,Anwesha Nilesh Taru,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262260188,Arnav Anurag Gandhi,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262260506,Ashish Kumar,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262261548,Bhargav Pankaj Joshi,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262261806,Divyansh Girish Kumar Chaudhary,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262260736,Moksh Damodhar Shivankar,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262262025,Mukesh Kumar Manikant Roy,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262262336,Ninad Mangesh There,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262262150,Nishil Patel,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262261613,Pracheeta Arunkumar Chandak,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262260974,Rakshit Srivastava,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262262361,Rujula Nana Gaikwad,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262260268,Rutuja Prasad Kalghatgi,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262262462,Sarthak Sachin Rochakri,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262260454,Shoumik Kaustubh Bedekar,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262261347,Swanand Jitendra Maheshmalkar,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262261251,Vivan Monteiro,B.Tech Electronics and Communication Engineering,16 - FY ECE,2
1262261130,Abhijith D,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261701,Anish Rahul Mujumdar,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262260381,Arush Manoj Alat,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261555,Atharva Lakshman Umate,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261350,Bhavin Mayur Sancheti,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262262509,Chitra Narayan Kochak,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262262288,Divija Rahul Gudadhe,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261255,Janhavi Sandesh Deshmukh,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262262449,Kiranmayi Taniparthi,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261782,Kishan Naarayanan S S,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262262371,Mahant Prabhu Das,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261315,Mahir Bhushan Gandhi,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261005,Mayank Prithviraj Patil,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262262539,Mitali Sachin Mutha,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261375,Pranav Gholkar,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262260979,Rohan Siddharth Devasthali,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261270,Sanchi Sachin Patil,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261484,Shaurya Prakash Khandekar,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261525,Shubham Basagonda Chhapari,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261975,Soham Amol Junnarkar,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262262068,Swarada Jitendra Barve,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262260609,Tanaya Amarnath Selmokar,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261756,Umaima Hatim Darugar,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261221,Vedant Jayesh Patil,B.Tech Electronics and Communication Engineering,16 - FY ECE,3
1262261869,Aarsh Atul Jain,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262521,Aarya Narendra Bharati,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261543,Adarsh Badi,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261103,Aditya Mandal,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262367,Ahana Lahariya,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261473,Akshit Amit Kulkarni,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262510,Aryan Shamkant Kale,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262570,Ashita Jain,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261100,Avani Kedar Patwardhan,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262160,Ayan Kumar,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261486,Devansh Sunil Karne,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262020,Dksh Vipin Hinger,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262182,Eshan Mohan,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261384,Gargee Deepak Gugale,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261884,Jashpreet Singh,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261269,Krishna Mahendra Vithlani,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262413,Manjiri Kishor Patil,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261172,Mohak Abhijeet Khare,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262645,Parth Sunil Rajput,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261678,Prince Manik Rahangdale,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262260554,Rhythma Shukla,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261094,Rijul Rupesh Udar,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261066,Rituraj Megharaj Pawar,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262561,Saksham Garg,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261801,Sakshi Bansode,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262447,Shourya Jain,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261409,Shriya Aniruddha Karanjekar,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261582,Sujal Suresh Rajput,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262602,Suraj Pramod Mete,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262093,Tanishka Nilesh Chavan,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261904,Tanmay Kartik Wagdeo,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261475,Vedant Vinayak Velapure,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262262635,Yugang Gajanan Jaiswal,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,1
1262261529,Aaryan Ghat,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261476,Adrian Vijay Abraham,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261333,Anishka Amrit Dey,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262341,Arjit Mehrotra,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261817,Arnav Prashant Ghongade,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262119,Arya Amol Doifode,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262456,Aryan Nilesh Jaiswal,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261776,Ayushi Yogesh Patil,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261800,Divya Aditya Choudha,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261790,Gaurava Chandra,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261898,Harshvardhan Avinash Kolte,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261083,Jiya Nikesh Raval,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262260958,Lakshya Sharma,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262180,M. Shreyam,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262088,Manasvi Sharanya Mattangi,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261980,Naitik Agarwal,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261557,Naman Vats,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262039,Nandini Raut,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261504,Ojas Bhushan Dongare,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262260669,Parvathi Kavungal Manoj,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262307,Pushpendra Sahu,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262422,Rajnandini Hemant Tarwate,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262260966,Rishi Pradipkumar Kumavat,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262618,Samuel Robert Kamble,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261390,Sanskruti Vikas Kushare,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262262237,Sanskruti Rahul Tapkir,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262260738,Satvik Sandeep Pagar,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261847,Shourya Rungta,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261123,Shurbhi Mandal,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261070,Swasti Shailesh Doshi,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261370,Tvisha Gupta,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261239,Vedant Harshal Nashte,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261647,Yashmit Yogesh Pokale,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,2
1262261719,Aditya Sambhaji Choudhari,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261659,Adwait Vaishampayan,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262555,Anuj Dinesh Narkhede,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262603,Aradhya Deepak Jain,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261492,Atharv Pramod Shinde,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261265,Chinmay Chintamani Lonkar,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261974,Darshan Chenaram Chaudhary,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262474,Dhanush Dheeraj Kudale,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262260711,Eshkol Godfrey Dsouza,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262401,Inaya Rehman,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261207,Kalyani Naran Tukadiya,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262260088,Kanav Amit Tejwani,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261445,Manas Deshpande,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261021,Navneeth K L,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261273,Om Laxman Jarande,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262096,Om Dilip Hinge,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261496,Pragyan Katyayan,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262137,Prisha Mohan Shete,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262315,Prutha Suresh Mungse,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262362,Rahul Domajee Patle,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261552,Rajdeep Pradeep Nimhan,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261481,Riya Yogesh Tiwari,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261679,Sai Surendra Soni,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261657,Shaarav Santosh Patil,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261437,Shravani Prafulla Deshpande,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262431,Shreyansh Shreeharsh Sahu,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261737,Siddhi Vivek Sharma,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262198,Swara Vinay Tamhan,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261266,Tanaya Dinesh Nirawane,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262262492,Tanishka Devadatta Navale,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261989,Vastvi Nitin Gulati,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262260133,Ved Vinay Kulkarni,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3
1262261060,Veeha Fadadu,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),18 - FY ECE AIML,3`;

const extraStudents = extraCsv16and18.trim().split('\n').map(line => {
  const parts = line.split(',');
  return {
    prn: parts[0]?.trim(),
    name: parts[1]?.trim(),
    branch: parts[2]?.trim(),
    division: parts[3]?.trim(),
    batch: parseInt(parts[4]?.trim() || '1')
  };
}).filter(s => s.prn && s.name);

// Merge with parsed.students
const combinedStudents = [...parsed.students, ...extraStudents];

// Deduplicate by PRN
const studentMap = new Map();
combinedStudents.forEach(s => studentMap.set(s.prn, s));
const allStudents = Array.from(studentMap.values());

// Distinct divisions
const distinctDivisions = [...new Set(allStudents.map(s => s.division))].sort((a,b) => {
  const numA = parseInt(a.split('-')[0]) || 0;
  const numB = parseInt(b.split('-')[0]) || 0;
  return numA - numB;
});

console.log('Total verified students:', allStudents.length);
console.log('Total verified divisions count:', distinctDivisions.length);
console.log('Divisions:', distinctDivisions);

// Division Course mapping
const divisionCourseMap = {
  'CSE': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Neha Deshpande' },
    { code: 'CSE10010', name: 'Foundations of Programming', credits: 4, faculty: 'Prof. Anand Kulkarni' },
    { code: 'PHY10010', name: 'Engineering Physics', credits: 3, faculty: 'Dr. Suresh Patil' },
    { code: 'CSE10040', name: 'Python Programming', credits: 2, faculty: 'Prof. Rashmi Joshi' }
  ],
  'AIDS': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Neha Deshpande' },
    { code: 'CSE10010', name: 'Foundations of Programming', credits: 4, faculty: 'Prof. Anand Kulkarni' },
    { code: 'UNC10160', name: 'AI for Everyone', credits: 2, faculty: 'Prof. Sunita Deshmukh' },
    { code: 'CSE10040', name: 'Python Programming', credits: 2, faculty: 'Prof. Sunita Deshmukh' }
  ],
  'CSF': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Neha Deshpande' },
    { code: 'CSF10010', name: 'Foundations of Programming', credits: 4, faculty: 'Prof. Vikas Shinde' },
    { code: 'CSF10020', name: 'Foundations of Computer Architecture and System Design', credits: 4, faculty: 'Dr. Amit Trivedi' },
    { code: 'CSE10040', name: 'Python Programming', credits: 2, faculty: 'Prof. Rashmi Joshi' }
  ],
  'CLOUD': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Neha Deshpande' },
    { code: 'CSE10010', name: 'Foundations of Programming', credits: 4, faculty: 'Prof. Anand Kulkarni' },
    { code: 'CSE10020', name: 'Foundations of Computer Architecture and System Design', credits: 4, faculty: 'Dr. Amit Trivedi' },
    { code: 'CSE10040', name: 'Python Programming', credits: 2, faculty: 'Prof. Rashmi Joshi' }
  ],
  'ECE': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Milind Kadam' },
    { code: 'ECE10070', name: 'Basics of Electrical and Electronics Engineering', credits: 4, faculty: 'Prof. Rajesh Shinde' },
    { code: 'ECE10050', name: 'Digital Electronics', credits: 4, faculty: 'Dr. Pradeep Jadhav' },
    { code: 'ECE10030', name: 'Python Programming', credits: 1, faculty: 'Prof. Anjali More' }
  ],
  'AIML': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Milind Kadam' },
    { code: 'ECE10070', name: 'Basics of Electrical and Electronics Engineering', credits: 4, faculty: 'Prof. Rajesh Shinde' },
    { code: 'ECE20370', name: 'Analog and Digital Electronics', credits: 4, faculty: 'Dr. Pradeep Jadhav' },
    { code: 'ECE10030', name: 'Python Programming', credits: 1, faculty: 'Prof. Anjali More' }
  ],
  'MECH': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Sandeep Koli' },
    { code: 'MEC10021', name: 'Engineering Graphics', credits: 3, faculty: 'Prof. Meera Joshi' },
    { code: 'MEC10010', name: 'Ideas and Innovations in Manufacturing', credits: 1, faculty: 'Prof. Pravin Pawar' },
    { code: 'PHY10010', name: 'Engineering Physics', credits: 3, faculty: 'Dr. Suresh Patil' }
  ],
  'CIVIL': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Sandeep Koli' },
    { code: 'CIV10010', name: 'Engineering Mechanics', credits: 3, faculty: 'Prof. Nitin Patil' },
    { code: 'CIV10020', name: 'Surveying Field Practices', credits: 2, faculty: 'Prof. Santosh Gite' },
    { code: 'CHM10011', name: 'Engineering Chemistry', credits: 3, faculty: 'Dr. Swati Kulkarni' }
  ],
  'BIO': [
    { code: 'EMT11150', name: 'Mathematics for Bioengineers-I', credits: 3, faculty: 'Dr. Sandeep Koli' },
    { code: 'BIE20010', name: 'Cell and Molecular Biology', credits: 3, faculty: 'Prof. Sneha Kadam' },
    { code: 'BIE20020', name: 'Human Anatomy and Physiology', credits: 2, faculty: 'Dr. Rakesh Salunke' },
    { code: 'CHM10011', name: 'Engineering Chemistry', credits: 3, faculty: 'Dr. Swati Kulkarni' }
  ]
};

// Coordinators mapped across all 32 divisions
const coordinators = [
  {
    id: 'coord-1',
    name: 'Prof. Dr. Anand Kulkarni',
    email: 'anand.kulkarni@mitwpu.edu.in',
    department: 'School of Computer Science & Engineering',
    assignedDivisions: ['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE'],
    subjects: ['CSE10010 - Foundations of Programming', 'CSE10040 - Python Programming']
  },
  {
    id: 'coord-2',
    name: 'Prof. Rashmi Joshi',
    email: 'rashmi.joshi@mitwpu.edu.in',
    department: 'School of Computer Science & Engineering',
    assignedDivisions: ['5 - FY CSE', '6 - FY CSE', '7 - FY CSE'],
    subjects: ['CSE10010 - Foundations of Programming', 'CSE10040 - Python Programming']
  },
  {
    id: 'coord-3',
    name: 'Prof. Sunita Deshmukh',
    email: 'sunita.deshmukh@mitwpu.edu.in',
    department: 'School of CSE (AI & Data Science)',
    assignedDivisions: ['8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS', '11 - FY CSE AIDS', '12 - FY CSE AIDS'],
    subjects: ['UNC10160 - AI for Everyone', 'CSE10040 - Python Programming']
  },
  {
    id: 'coord-4',
    name: 'Prof. Vikas Shinde',
    email: 'vikas.shinde@mitwpu.edu.in',
    department: 'School of Cyber Security & Cloud',
    assignedDivisions: ['13 - FY CSE CSF', '14 - FY CSE CLOUD'],
    subjects: ['CSF10010 - Foundations of Programming', 'CSE10020 - Computer Architecture']
  },
  {
    id: 'coord-5',
    name: 'Prof. Rajesh Shinde',
    email: 'rajesh.shinde@mitwpu.edu.in',
    department: 'School of Electronics & Communication',
    assignedDivisions: ['15 - FY ECE', '16 - FY ECE', '17 - FY ECE AIML', '18 - FY ECE AIML'],
    subjects: ['ECE10070 - Basics of Electrical & Electronics', 'ECE10050 - Digital Electronics']
  },
  {
    id: 'coord-6',
    name: 'Prof. Milind Kadam',
    email: 'milind.kadam@mitwpu.edu.in',
    department: 'School of Electrical & Semiconductor',
    assignedDivisions: ['19 - FY E&CE', '20 - FY SEM VLSI', '21 - FY REN ENE'],
    subjects: ['ERE10010 - Electrical Fundamentals', 'ESV10010 - Semiconductor Technology']
  },
  {
    id: 'coord-7',
    name: 'Prof. Meera Joshi',
    email: 'meera.joshi@mitwpu.edu.in',
    department: 'School of Mechanical Engineering',
    assignedDivisions: ['22 - FY MECH', '23 - FY MECH', '24 - FY MECH ROBO', '25 - FY MECH ROBO'],
    subjects: ['MEC10021 - Engineering Graphics', 'MEC10010 - Innovations in Manufacturing']
  },
  {
    id: 'coord-8',
    name: 'Prof. Pravin Pawar',
    email: 'pravin.pawar@mitwpu.edu.in',
    department: 'School of Chemical, Materials & Petroleum',
    assignedDivisions: ['26 - FY CHEM', '27 - FY MSE', '28 - FY PETRO'],
    subjects: ['CHM10011 - Engineering Chemistry', 'MSE20010 - Materials Science']
  },
  {
    id: 'coord-9',
    name: 'Prof. Nitin Patil',
    email: 'nitin.patil@mitwpu.edu.in',
    department: 'School of Civil Engineering',
    assignedDivisions: ['29 - FY CIVIL', '30 - FY CIVIL SMART'],
    subjects: ['CIV10010 - Engineering Mechanics', 'CIV10020 - Surveying Field Practices']
  },
  {
    id: 'coord-10',
    name: 'Prof. Sneha Kadam',
    email: 'sneha.kadam@mitwpu.edu.in',
    department: 'School of Bioengineering',
    assignedDivisions: ['31 - FY BIO', '32 - FY BIO'],
    subjects: ['BIE20010 - Cell and Molecular Biology', 'BIE20020 - Human Anatomy and Physiology']
  }
];

const feedbackQuestions = [
  {
    id: 'q1',
    category: 'Teaching Effectiveness',
    text: 'How clearly does the instructor explain key concepts and theoretical principles?',
    type: 'rating_5',
    description: '1: Very Poor, 2: Poor, 3: Average, 4: Good, 5: Excellent'
  },
  {
    id: 'q2',
    category: 'Course Delivery & Pace',
    text: 'The pace of syllabus coverage and adherence to lecture schedules is appropriate.',
    type: 'rating_5',
    description: '1: Strongly Disagree to 5: Strongly Agree'
  },
  {
    id: 'q3',
    category: 'Practical & Lab Engagement',
    text: 'Hands-on practicals, lab exercises, and assignments support better understanding of the subject.',
    type: 'rating_5',
    description: '1: Inadequate to 5: Highly Effective'
  },
  {
    id: 'q4',
    category: 'Doubt Resolution & Support',
    text: 'The faculty member is accessible and effectively resolves student doubts inside and outside class.',
    type: 'rating_5',
    description: '1: Rarely to 5: Always Accessible'
  },
  {
    id: 'q5',
    category: 'Course Material & Resources',
    text: 'Quality and usefulness of study notes, slides, and reference materials provided on LMS.',
    type: 'rating_5',
    description: '1: Very Poor to 5: Comprehensive & High Quality'
  },
  {
    id: 'q6',
    category: 'Suggestions & Feedback',
    text: 'Constructive suggestions for syllabus enrichment or faculty teaching methodology (Optional)',
    type: 'text',
    description: 'Open text feedback'
  }
];

// USER EXPLICIT REQUIREMENT: "no dummy data, all login according to given data"
// Start with an empty list of feedback responses so every percentage and response reflects actual submitted data!
const seedResponses = [];

const fileContent = `// MIT-WPU First Year Engineering Student Feedback Portal Data
export const STUDENTS = ${JSON.stringify(allStudents, null, 2)};

export const COURSES = ${JSON.stringify(parsed.courses, null, 2)};

export const ALL_DIVISIONS = ${JSON.stringify(distinctDivisions, null, 2)};

export const DEFAULT_PASSWORDS = {
  student: 'Student@123',
  teacher: 'Teacher@123',
  admin: 'Admin@123'
};

export const COORDINATORS = ${JSON.stringify(coordinators, null, 2)};

export const FEEDBACK_QUESTIONS = ${JSON.stringify(feedbackQuestions, null, 2)};

export const DIVISION_COURSE_MAP = ${JSON.stringify(divisionCourseMap, null, 2)};

export function getCoursesForDivision(divName) {
  if (!divName) return DIVISION_COURSE_MAP['CSE'];
  if (divName.includes('CSF')) return DIVISION_COURSE_MAP['CSF'];
  if (divName.includes('CLOUD')) return DIVISION_COURSE_MAP['CLOUD'];
  if (divName.includes('AIDS')) return DIVISION_COURSE_MAP['AIDS'];
  if (divName.includes('AIML')) return DIVISION_COURSE_MAP['AIML'];
  if (divName.includes('ECE') || divName.includes('E&CE') || divName.includes('SEM VLSI')) return DIVISION_COURSE_MAP['ECE'];
  if (divName.includes('MECH') || divName.includes('REN ENE')) return DIVISION_COURSE_MAP['MECH'];
  if (divName.includes('CIVIL')) return DIVISION_COURSE_MAP['CIVIL'];
  if (divName.includes('BIO') || divName.includes('CHEM') || divName.includes('MSE') || divName.includes('PETRO')) return DIVISION_COURSE_MAP['BIO'];
  return DIVISION_COURSE_MAP['CSE'];
}

// User specified NO dummy data - starts completely clean
export const INITIAL_RESPONSES = ${JSON.stringify(seedResponses, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'initialData.js'), fileContent);
console.log('Successfully generated initialData.js with 32 divisions and 0 dummy data!');
