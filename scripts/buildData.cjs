const fs = require('fs');
const path = require('path');

// Raw CSV from user prompt
const rawStudentCsv = `PRN,Student Name,Branch,Division,Practical Batch
1272260395,Aarna Anand Naware,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261002,Abeer Agrawal,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261789,Aditya Prakash,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261342,Ansh Deepak Shivangi,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261863,Aryan Tomar,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272262303,Atharva Priyesh Veedu,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272262151,Ayaan Sheikh,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261692,Ayush Dubey,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272262479,Dhruva Parag Chitnis,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272260488,Hamdan Bin Shiejeeb,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272260703,Mehul Patidar,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261857,Parinith Shetty,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261923,Saksham Santosh Raje,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261545,Saloni Santosh Shrivastav,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261022,Shabd Wankhede,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272260527,Simran Ravikumar Gandhi,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272260706,Tanmay Kumar,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261010,Vidhi Tulsyan,B.Tech Computer Science and Engineering,1 - FY CSE,1
1272261568,Aayushi Vilas Umbare,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261177,Agrima Raghuvanshi,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272262240,Arjun Pramod Kachare,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261953,Ark Raj,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272262072,Atharv Gajanan Dhakre,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272262428,Harsh Satysen Patil,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261587,Ira Chandrashekhar Bandekar,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261087,Khadija Irshad Godme,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272260444,Krish Rupesh Gopani,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261980,Mahak Ghanshyam Laddha,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272262524,Manasvi Jayesh Mutha,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261088,Piyush Pitre,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261058,Rishika Shivadharlal Shiva,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272262410,Rishita Prashant Kavishwar,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272260528,Shivani Arun Seena,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261037,Sohan Arvind Narkhede,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272262493,Swanandi Shekhar Deshmukh,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261445,Utkarsh Shantilal Mohalkar,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261746,Wilyn Nimish Saraf,B.Tech Computer Science and Engineering,1 - FY CSE,2
1272261573,Ananya Vivek Temkar,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272261107,Aum Abhijeet Kolte,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272261332,Dhyan Piyushkumar Patel,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272261277,Ishwari Rajendra Mali,B.Tech Computer Science and Engineering,1 - FY CSE,3
1262260376,Kosh Jain,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272261236,Lekh Chawda,B.Tech Computer Science and Engineering,1 - FY CSE,3
1262260343,Manas Sunil Tale,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272260451,Prisha Prasad Kunder,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272261878,Ronak Vilasrao Patil,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272260562,Sarthak Jitendra Patil,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272262287,Sarvesh Sachin Wagh,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272262251,Shaunak Abhay Karekar,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272261488,Shreya Sanjay Lakhade,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272261976,Tanish Chandra,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272260940,Vedant Hanmant Bakal,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272262063,Vihaan Ajay Pawal,B.Tech Computer Science and Engineering,1 - FY CSE,3
1272261712,Aarnavi Kashyap,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261047,Aditya Nandkishor Aher,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261585,Akshat Vivek Bhardwaj,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261059,Aryansh Alok Singh,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261494,Ayush Singh,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272262134,Dhruv Tambi,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261032,Hardik Rahul Shelke,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261052,Jyotmeher Bedi,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272262452,Krushna Anil Bahirat,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261018,Mihir Mukund Pendse,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261674,Parth Parag Patil,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272260984,Rajasi Nerkar,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261855,Samarth Tanaji Godage,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261922,Shreya Mahesh Kolhe,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272262166,Shreya Mahesh Zawar,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261444,Smit Nileshbhai Kavathiya,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261470,Tanushree Santosh Bhoite,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272262258,Vedangi Vinod Naik,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261309,Vihan Vivek Butley,B.Tech Computer Science and Engineering,2 - FY CSE,1
1272261547,Akshat Mahavir Durugkar,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261511,Arjun Deepak Patil,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272262235,Aroushi Vishwakarma,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261113,Atharva Hemant Neve,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272260284,Debadrish Bhowmick,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272262080,Ekta Abhay Wagadre,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261185,Khushi Paras Khinvasara,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272262321,Mayank Bijarniya,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272262520,Nikhil Khera,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261543,Pragya Arora,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261244,Rishika Vishal Bafna,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272260097,Saideep Prashant Barge,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261653,Shivanjali Mishra,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272262541,Shrikant Kishor Gawande,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272262545,Soham Nitin Badge,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261068,Sonkee Milind Joshi,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261251,Yash Pandurang Shelar,B.Tech Computer Science and Engineering,2 - FY CSE,2
1272261176,Arush Jha,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261803,Avaneesh Shirish Deshpande,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272262393,Aviral Gothwal,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261711,Divyanshu Singh,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272260670,Jaganadh Ms,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261227,Lisha Tejas Patil,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272262144,Mahak Agarwal,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261646,Nityam Nileshbhai Lathiya,B.Tech Computer Science and Engineering,2 - FY CSE,3
1262261064,Omkar Hemant Dhimte,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261988,Parth Pravinkumar Pawar,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272262031,Prakash Sakharam Choudhary,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261223,Priyal Alok Khandelwal,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261117,Saanvi Chikyala,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272262529,Samarth Navanath Shinde,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261737,Sarthak Mahesh Pawar,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261556,Surabhi Pramod Dhore,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272260707,Vedant Sunil Sakore,B.Tech Computer Science and Engineering,2 - FY CSE,3
1272261540,Aarsh Chetan Jain,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261125,Advaet Umesh Chintakunta,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272260102,Anand Lakshmikanth,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261847,Anshul Amit Gosavi,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261462,Aryarajsinh Kishorsinh Jadeja,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272262304,Bhumika Dilip Dhamane,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261435,Chhand Tyagi,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261532,Kabir Pramod Pardeshi,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261351,Minakshi Sachin Zope,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272262283,Nishita Vinay Thombre,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261144,Parth Gorakhnath Jadhav,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261592,Rajiv Ajit Shinde,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272262447,Saee Sachin Siddhe,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272260664,Samarth Ganesh Dombe,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272260944,Sharvi Jindhar Chougule,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261921,Swar Sagar Gandhi,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261085,Tanvi Basawaraj Somashetti,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272262164,Uzair Zaheer Rawal,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272261159,Vinayak Dhanyakumar Kolhe,B.Tech Computer Science and Engineering,3 - FY CSE,1
1272262280,Aaryan Ajit Kavitake,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261216,Abhinav Kumar,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261204,Akshay Srinivasa,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272260532,Arjun Rastogi,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261184,Atharva Sunil Patil,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272262544,Hitesh Rajpal,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261092,Khushi Milind Prabhudesai,B.Tech Computer Science and Engineering,3 - FY CSE,2
1262262099,Mohammad Hamdaan Valsangkar,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261710,Neev Nileshkumar Panchal,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272262549,Pranjal Sharma,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261610,Rohit Manglani,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261346,Sanika Sanjay Vaidya,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261049,Shivansh Saurabh Vijayvergiya,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272262284,Shreyas Ramdas Dhage,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272260490,Sonu Kumar Chaurasiya,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261659,Yash Rajanikant Mane,B.Tech Computer Science and Engineering,3 - FY CSE,2
1272261188,Aadit Kaul,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261460,Aditya Narendra Chavan,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261666,Animesh Misra,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272262415,Anoushka Ranjit Ganguly,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261103,Aryan Sagar Bandekar,B.Tech Computer Science and Engineering,3 - FY CSE,3
1262260908,Atharva Nitin Bauskar,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272262255,Ayush Pramod Nalavade,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261560,Drishti Satish Rai,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261421,Jahnavi Sarang Deshkar,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261050,Maithili Ashtaputre,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261155,Ojas Manish Khodaskar,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272262478,Pranjal Bujetya Mukesh Kumar Meena,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261331,Purushottam Shyam Jadhav,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261457,Sachi Shamrao Gade,B.Tech Computer Science and Engineering,3 - FY CSE,3
1262260940,Sarthak Dhyani,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261036,Shriya Yati Kokare,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261795,Swara Kandalkar,B.Tech Computer Science and Engineering,3 - FY CSE,3
1272261241,Aarvi Manish Rathod,B.Tech Computer Science and Engineering,4 - FY CSE,1
1262261119,Aditya Anand Ashtekar,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261398,Advait Agrahari,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272262068,Alyssa Deepak Dhembre,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261938,Anushka Ganesh Bhoite,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272262320,Anvay Bhatli,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272260673,Arijit Pattanaik,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261464,Chhavi Chandrabhushan Singh,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272262453,Chitranshu Sahu,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261480,Hasan Murtaza Chasmawala,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261034,Mrudula Sunil Dere,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272260337,Parth Mahesh Pharande,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261334,Rajveer Gaurav Sanghavi,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272262206,Shayaan Shahnawaz Khan,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272260672,Soham Sudhir Mahadik,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261203,Tejaswi Shivraj Mone,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261667,Vinayak Jay Sharma,B.Tech Computer Science and Engineering,4 - FY CSE,1
1272261760,Abhiraj Singh Chauhan,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272260396,Aliza Naseem Shirshikar,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261420,Arnav Atul Bhusari,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272260719,Atharva Prashant Shinde,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261131,Ishaan Udaya Mogaveera,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261030,Krishna Sudhir Aklade,B.Tech Computer Science and Engineering,4 - FY CSE,2
1262260493,Namasvi Shantaram Mahajan,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272262347,Omkar Rajesh Mane,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261748,Pranav Prasad Haldule,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261810,Rudra Shitalkumar Dhole,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272262449,Sarthak Sanjay Parkhe,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261220,Shlesha Sanjay Ghare,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272260100,Shlok Yogesh Bute,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261443,Sourav Mishra,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272262276,Tanish Mantri,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261339,Varun Maruti Maskar,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261967,Vatsa Shashin Deputy,B.Tech Computer Science and Engineering,4 - FY CSE,2
1272261599,Aaditya Balsara,B.Tech Computer Science and Engineering,4 - FY CSE,3
1262261606,Aayush Rajesh Hambarde,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272260671,Aditya Kulkarni,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261438,Anish Prakash Jadhav,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272260691,Avaneesh Sambhaji Bhosale,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261183,Dwij Dipu Prasad,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261518,Jainam Mahesh Jain,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272262372,Kriyan Shah,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261399,Manasdeep Nitin Borole,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272262237,Meet Nitin Gidwani,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261652,Omkar Narendra Kulkarni,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261406,Pushpak Agrawal,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272260735,Sahil Kudi,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272262125,Samey Rahul Kothavade,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261065,Saumya Samit Patil,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261143,Shruti Ramji Gupta,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272260388,Swarali Shreekanth Joshi,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272262386,Taksh Jain,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261013,Vedant Mahesh Jadhav,B.Tech Computer Science and Engineering,4 - FY CSE,3
1272261801,Aarya Agrawal,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272261089,Advika Aniket Bakore,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272261015,Antariksh Pramod Papade,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272261126,Asmita Manoj Dalvi,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272261486,Chhavi Goyal,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272262257,Jay,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272260334,Karan Ramesh Nair,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272261237,Mrudula Sanjay Maske,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272261168,Philip Bentolouis Fernandes,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272262465,Priyansh Nitin Anasane,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272260560,Ranvijay Nilesh Jagtap,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272261024,Samiksha Patrikar,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272262281,Saptarchi Manna,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272262222,Sarthak Santosh Dhage,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272262361,Sarthak Ravindra Choudhari,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272262005,Satyam Vishnu Tambade,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272262497,Shandra Jiss,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272260491,Vishnu Ashok Bhandare,B.Tech Computer Science and Engineering,5 - FY CSE,1
1272261366,Adbhut Khandelwal,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272261266,Arnav Sameer Zagade,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272261433,Ishan Ravindra Pawar,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272262279,Kavya Ashish Bansal,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272262081,Nikita Abhijit Deokule,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272260342,Nimai Gaurang Gorasiya,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272262118,Palak Sagar Baldota,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272260489,Pranit Santosh Dere,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272262509,Ritesh Bajaj,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272261791,Sanyat Sharma,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272262488,Shahzeb Irfan Kazi,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272261097,Shourya Santosh Karkar,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272261007,Sradha Saiju,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272262282,Tanvi Madhav Rathod,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272261388,Varun Singhal,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272261949,Yash Rajendra Wankhede,B.Tech Computer Science and Engineering,5 - FY CSE,2
1272261528,Aditya Bind,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272262443,Akshara Rameshwar Maniyar,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261123,Anisha Aniket Inamdar,B.Tech Computer Science and Engineering,5 - FY CSE,3
1262253115,Aryan Prafulla Taralekar,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272260430,Aryan Pankaj Hedaoo,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272260332,Avni Manoj Madhavan,B.Tech Computer Science and Engineering,5 - FY CSE,3
1262261019,Ethan Luell Lopes,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261678,Eva Santhosh,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261128,Jayesh Mahendra Jagtap,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261189,Manthankumar Sandip Keni,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272260448,Owais Arzam,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272262248,Prutha Preshit Todkari,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261405,Rachit Rahul Gandhewar,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261983,Satyam Kumar,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261450,Sayyam Gautam Soni,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261147,Shubh Singh,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261019,Swarnim Suhas Pande,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272262391,Tanmay Sharma,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261660,Vedika Shantibhushan Suryawanshi,B.Tech Computer Science and Engineering,5 - FY CSE,3
1272261491,Aatish Naveen Das,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261390,Aayush Jha,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272262078,Aditi Navnath Jadhav,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272262318,Ammar Kausar Khan,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272262507,Anshi Jain,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261724,Anuj Adhik Gurav,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261328,Chinmay Amit Kulkarni,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272262483,Lakshika Yashpal Satija,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272260956,Muhammed Shezin,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261455,Piyush Jain,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261294,Riddhi Jain,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261083,Sammit Santosh Kharolkar,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261753,Shiv Shailesh Kawalkar,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272262195,Shreyash Rangnath Khaire,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261931,Shrikar Nitin Zargad,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261127,Soham Kedar Mulay,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261497,Trisha Pankaj Jambhale,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272262475,Vedika Shivraj Lokhande,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272261825,Vivek Chandora,B.Tech Computer Science and Engineering,6 - FY CSE,1
1272260695,Amey Maheshkumar Inamdar,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261471,Arnav Bhati,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261368,Atharva Sudhakar Patil,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261869,Chirag Manoj Jadhav,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261003,Dhanush Sri Shanmugam Mudhaliar,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272262487,Ipshita Manish Solanki,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261461,Ishant Santosh Mahadik,B.Tech Computer Science and Engineering,6 - FY CSE,2
1262260703,Jiya Chandani,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261808,Kulshree Sharma,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261027,Niral Aparish Shetty,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261004,Prathamesh Kishor Pawar,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261487,Rutuja Dhananjay Gurav,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272262076,Sanchit Rauniyar,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272260961,Sarah Zubair Ahmed Sarguroh,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272262522,Sarthak Ravikant Chavan,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261028,Shreeom Deepak Paigude,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272262224,Srushti Pramod Soma,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261347,Stuti Jain,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272261960,Yashraj Kiran Patil,B.Tech Computer Science and Engineering,6 - FY CSE,2
1272262051,Aadima Kiran Galande,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261040,Aditya Patel,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272262148,Akshat Farkya,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261385,Anishk Sharma,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261201,Avnish Mukesh Agarwal,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261706,Gaurav Kumar Singh,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272262188,Harshawardhan Ashok Kale,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272260454,Jimee Jain,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272262253,Kanishka Gupta,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261245,Meera Vaibhav Kulkarni,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272262439,Mugdha Ghanashyam Kirve,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272262204,Naman Dipak Rathi,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261276,Radha Vinay Joshi,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272260620,Sakshi Sharma Belbase,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261728,Sejal Sandip Akkangire,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261048,Siddhesh Patil,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272261363,Tahir Suhail Inamdar,B.Tech Computer Science and Engineering,6 - FY CSE,3
1272262128,Aayush Nitin Ghumare,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272262120,Abhinav Agrawal,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272262060,Anurag Shukla,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261408,Anushka Nitin Desai,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261996,Aryaa Sandip Jadhav,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261689,Crystal Thagunna,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261234,Hiren Dev,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272262421,Joshua Noble,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261106,Ketaki Ajay Gadgil,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272262419,Kunal Kautik Khadke,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272262178,Manan Bharat Panchal,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261067,Nandit Goyal,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261695,Piyush Raj,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272262504,Purvesh Vijay Darwatkar,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261180,Rishan Sharma,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272262313,Sarvesh Sahebrao Gawande,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261807,Unmil Atul Jawale,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272261946,Varun Amol Tarte,B.Tech Computer Science and Engineering,7 - FY CSE,1
1272260583,Ananya Shivaprasad,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272262374,Anirudh Soni,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272261975,Anwesha Alok Kumar Sinha,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272260949,Arnav Jakkapalli,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272261124,Dhruv Hemant Sonawane,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272262200,Drishti Ravi Israni,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272261138,Harshil Niravbhai Shukla,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272261665,Ishmeetsingh Surjeetsingh Sawlani,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272262557,Jose Fernandes Bimbi Dombaxi Andre,B.Tech Computer Science and Engineering,7 - FY CSE,2
1262260881,Lakshya Singh,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272261133,Niranjan Ranjith,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272260997,Prathvi Raju Poojari,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272261376,Ryan Sushant Narkar,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272262077,Sakshi Sunil Kanjwani,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272260975,Stuti Kashyap,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272260338,Vedanshi Sagar Vadher,B.Tech Computer Science and Engineering,7 - FY CSE,2
1272261361,Aarna Samesh Shah,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261285,Aditya Prashant Yewale,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261173,Anishka Adarsh Upadhye,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272262494,Atharv Mahindra Katkar,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272262403,Bhoomi Esarka,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261413,Jonathan Bijoy Cheliparambil,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272262402,Kunal Ravindra Shinde,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261754,Pall Rajubhai,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272262226,Prasanna Pravin Joshi,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272262434,Priyal Sunil Gadekar,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272262202,Pruthviraj Prashant Eakde,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261082,Rahul Singh,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261271,Sejal Amit Suryavanshi,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261156,Siddhi Laxmikant Joshi,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272262196,Subhikshan Kumar Nadar,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261198,Vibha Manoj Nair,B.Tech Computer Science and Engineering,7 - FY CSE,3
1272261150,Aarav Anil Kumar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272260145,Abhyuday Tripathi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261872,Achyut Ajit Torvekar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261033,Aishwarya Bhushan Godbole,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272260611,Anya Gaur,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272260957,Auhona Chakraborty,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261233,Devanshi Nishant Chordia,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261729,Garima Thanwani,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261333,Joanne Joseph Fernandes,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261359,Lakshika Nandkishor Kabra,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272262528,Mayuresh Nitinkumar Bulbule,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261086,Nandini Ajay Rohilla,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272260677,Prabal Bhugoo,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261890,Pragya Sinha Mahapatra,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272262032,Renuka Subhash Kale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261584,Sanidhya Ravikant Shandilya,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272260994,Shivam Nitin Thakare,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272260482,Soham Mandar Sathe,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261383,Tanish Sudhakar Sail,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272262436,Tanish Jain,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272262238,Tanmay Tushar Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272260413,Venkatesh Sandeep Likhite,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,1
1272261415,Aarnavi Nilesh Tanpure,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272262146,Adeetya Nitin Agarwal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272260598,Anant Kumar Jaiswal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261597,Aryan Anup Mahajan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261229,Ayush Amrut Dabhekar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261934,Hardik Bachhawat,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261364,Harshita Vashistha,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261524,Kathan Sunil Patel,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261195,Maina Jain,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261589,Nikhil Makarand Chitale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272260361,Pranay Suman,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261986,Qusai Asif Sathalyawala,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272262495,Raj Dilip Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272260434,Rian Najar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272260414,Sahir Mohammad Alam,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261831,Satish Bhuraram Choudhary,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272262085,Shivani,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261377,Shreyas Dinesh Deore,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272262270,Soham Sanjay Khodke,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272261709,Toshik Alam Haq,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1262260667,Yash Rajesh Chiney,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272260704,Yashasvi Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,2
1272260359,Aditya Renjit,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272262183,Akshat Agarwal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261467,Anshul Aditya Verma,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272262515,Anvee Atul Phalke,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272260678,Ashwin Ajay Ghare,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272260958,Daksh Dwivedi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261631,Eshal Asif,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272262055,Harsh Deepak Angane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261465,Ishika Neeraj Mehta,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261948,Kaif Yusuf Mahedvi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272260410,Krish Rahul Durve,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272260967,Mohammed Adnan Mohammed Rayees,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272262288,Nikhil Ganesh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261134,Pahel Dinesh Gandhi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261080,Pratishtha Thakre,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261356,Rishikesh Prashant Kherde,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261744,Saksham Aggarwal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272260698,Shantanu Santosh Chhettiar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261060,Siddharth Sameer Sharma,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272262228,Tanvi Ravi Lot,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261757,Varad Vivek Chandankhede,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),8 - FY CSE AIDS,3
1272261154,Aarav Prashant Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272262400,Anushka Vikas Gorde,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261162,Archit Sandip Bhole,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272262246,Arshita Chauhan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1262260414,Darsh Mohit Gupta,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261437,Deven Haridas Sonawane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261137,Leisha Manish Jain,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261078,Nandini Navin Zamvar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272262217,Parth Sunil Vaidya,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272262404,Pauravi Manish Phuke,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272260449,Prachi Shailesh Thanki,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272262519,Pritesh Shravan Jadhav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261463,Rajvi Sagar Dudhat,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261296,Rutuja Rahul Mohite,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261196,Sanjit Rajan Dhole,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272262000,Shifaniya Shemeem,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272260632,Shivam Khera,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272260524,Soham Sandeep Charde,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261997,Sujeet Kapoor,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261548,Tanishka Uttam Khedkar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272262444,Vaishnavi Ranjan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272262135,Vasishth Gupta,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272260486,Vibha Vignesh Iyer,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,1
1272261984,Aarav Jain,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262091,Aaryan Chaudhari,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261856,Anaya Yogesh Phalke,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1262262364,Anwesha Shailendra Vaidya,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261357,Aryan Pradeep Kumar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262484,Chetana Amit Katariya,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1262260709,Daksh Gala,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262474,Durva Deepak Dalvi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262145,Ishwar Anand Shankar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262049,Ishwari Vishal Pimple,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1262260321,Madhav Unnikrishnan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262273,Malay Jain,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272260676,Manas Suhas Adhatrao,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261861,Nikhil Udayakumar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261933,Pratham Prataprao Deshmukh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262267,Shambhavi Palak Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262405,Shreya Shridhar Sawant,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261407,Shritej Paresh Shirude,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262396,Siddhi Purushottam Gohokar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261066,Supriya Netaji Mahadik,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261798,Trambkeshwar Omshankar Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261206,Yashraj Sandip Botre,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272262223,Yatik Tanmay Doshi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,2
1272261202,Aditya Amrut Bangar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261064,Anshuman Amit Kulkarni,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272262505,Anushri Thopte,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261787,Asmi Aniket Bhagwat,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272262293,Atharva Vishnu Naik,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272260899,Darsheel Chhajed,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272260408,Fawwaz Arshad,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272262197,Harsh Deepak More,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272260680,Ishita Satyajit Patki,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261968,Kanak Paryani,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261062,Krishna Sachin Tamgole,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261008,Mrigesh Milind Jadhav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261207,Palak Prasad Dhoot,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261213,Prayusha Mohnish Chordiya,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261544,Rudra Sunil Shinde,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261192,Samprikta Banerjee,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272260579,Shanvi Shaw,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272262165,Shruti Rani,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261529,Swanandi Mangesh Mahajan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1262261147,Swapnil Rajeshwar Patnaik,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272261136,Ved Khodaskar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),9 - FY CSE AIDS,3
1272262446,Aditya Sunil Mohite,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261255,Akshara Anand Rathod,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261243,Arin Virendra Nadgir,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272260399,Avi Bansal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272260439,Devika Ambat,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261512,Gaurav Nilesh Agarwal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272262124,Harpreet Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261839,Himanshi Ravi Agrawal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272260341,Leo George Thomas,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261930,Madan Varalaxmaiah Pagadala,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272262547,Mohammed Iqbal Patel,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272262221,Nimit Parag Mehta,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261141,Saanvi Sammit Potdar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261163,Sarang Sandesh Nair,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261718,Shorya Pratap Singh Rathore,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272262249,Siddharth Harish Shetty,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272260716,Sonit Sanjay Hanumante,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261139,Tanmay Santosh Khaire,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1262260706,Tejas Bharatrao Lahane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272262138,Vihaan Rajput,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272261070,Vinayak Sanjeev Kumar Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,1
1272262155,Aarush Arvind Bodgal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261061,Adinath Shrikant Amale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272260584,Angad Kaul,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261598,Aryandra Shrivastava,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261469,Chaitanya Bipinkumar Patel,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261562,Diggaj Ganesh Shete,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272260522,Hetvi Hiteshkumar Zanzmeria,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272262462,Himesh Maroti Atkari,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272260485,Manav R Nair,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261051,Nishita Nilesh Thorat,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272262047,Om Bhavankumar Mishra,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272262480,Om Bhushan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272262265,Pranav Shatendra Rao,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261326,Prapti Dashrath Chende,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261942,Ritvik Avinashchander Sharma,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272262543,Sayma Sahil Mhatre,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261476,Sejal Kiran Karale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272260133,Shritej Mohan Ghule,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261719,Surya Verma,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272260596,Unmesh Kiran Shinde,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272260487,Yazeed Sarwar Hafiz,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,2
1272261292,Aadheesh Amit Rane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261023,Aditya Pala,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261908,Aditya Abhijit Mudhole,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261338,Athaang Sanket Jambhekar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272262131,Ayaan Intekhab Shaikh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261169,Ishwaryaa Sethuraman Tamaram,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261432,Krishna Gaurav Laad,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272262297,Mitali Ajitkumar Sancheti,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272262126,Mokshi Jain,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261418,Mrudula Shriram Deshpande,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272262190,Ojas Dhananjay Ahirrao,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261135,Paras Abhaykumar Sakale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261963,Piyush Mangesh Mahadik,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261172,Preksha Pankaj Mehta,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272262503,Pruthviraj Murlidhar Huple,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261110,Samridhi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272262244,Sanvi Amol Jagtap,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272260970,Sidharth Sanjay Nair,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261171,Swara Sameer Barmukh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261297,Vedant Sachin Sane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272262262,Zuhair Zulfikar Kurane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),10 - FY CSE AIDS,3
1272261380,Akshay Suhas Joglekar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1262260101,Aryan Ravindra Bhagwat,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261119,Devin Johnson Rodrigues,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272260340,Gavin Nathan Pinto,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261181,Junaid Chand Nadaf,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272260571,Liteel Raj,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272262486,Manasvi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261775,Neha Ravindra Dhokale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272260711,Prajwal Manoj Dhumal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272262472,Rachit Mitesh Thacker,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261820,Raushan Raj Raj,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272262261,Rutwej Ravindra Nagare,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272260455,Sabel Daniel George,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272260576,Saransh Rampal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272262534,Shaikh Mohammed Athar Ali,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261466,Shouryan Santosh Baradkar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261848,Sonu Kumar Sah,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261926,Swajit Jitendra Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261745,Tanvi Umesh Arote,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272261816,Yash Shivaji Ingulkar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,1
1272262161,Aazain Adil Shaikh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261472,Aditi Bhardwaj,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261118,Ankita Pramod Reghate,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261956,Anushka Ravikiran Jadhav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272260406,Aryaraj Yuvraj Mhetre,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261454,Chandraprakash Ummed Kumar Pareek,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272260623,Duruwank Dinesh Pai,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272260417,Khadija Husain Sheikh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1262260675,Manish Mohan Choudhary,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261786,Om Sumit Shete,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261167,Prateekshya Pradhan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272262272,Prathamesh Bandu Pawar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261475,Rishi Pandharish Kulkarni,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272262364,Rudra Sandeep Dudhale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261498,Saksham Sujit Bora,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272260362,Shaanvir Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261005,Siddhant Sameer Deosthale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261490,Suryaprakash Sanwarmal Sharma,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261696,Unnati Satanappa Hurdale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272260415,Vaidehi Raosaheb Pandit,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261853,Yuvraj Pankaj Jaju,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,2
1272261038,Advaya Aashlesh Shrikhande,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261353,Anushka Rathore,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261792,Atharva Prashant Balwadkar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261100,Deepankar Shrikant Shukla,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261809,Ganesh Chetan Prajapati,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261044,Janhvi Abhijit Kharade,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272262094,Joravar Singh Jolly,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261132,Kshitij Rajesh Gaikwad,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272262422,Madhur Satish Kabra,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261751,Mubeen Muzammil Kazi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261114,Piyush Vijaykumar Chavan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272262264,Rishika Vivek Zavar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272262502,Rishika Singh Gehlot,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272260411,Rumaysa Khan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272262450,Samarth Suganchand Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261411,Sanchita Sadashiv Deshmane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272262236,Sharvil Rajendra Yadav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272260440,Sneha Dinesh Shet,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261742,Swarangi Santosh Sutar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272262227,Tanish Hitesh Kapadia,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272261379,Vedant Vinod Peshane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272262476,Yash Khatri,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),11 - FY CSE AIDS,3
1272260615,Aarjav Ajmera,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272260699,Alweena Cyril Jadhav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261941,Atharv Jain,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261395,Ayush Rohit Nagpure,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261055,Dhanashri Vishal Sawant,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272260589,Harshit Avdesh Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272260457,Kanhaal Kunnungaparambil Pramodh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272260466,Madhav Raj,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261282,Nidhi Mukeshkumar Gosai,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261439,Reeva Bhavesh Palrecha,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272262394,Rhucha Vijay Jadhav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261391,Sahil Ashish Loya,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261120,Sarhaan Riaz Mulani,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261586,Shravani Abhijit Belose,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272262451,Shreyansh Sachin Dharne,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272262245,Shubham Mangesh Jadhav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272262271,Shubham Kishor Vishe,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272260700,Soumya Kushwaha,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261063,Tisha Uday Jivrajani,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261535,Yash Prakash Sutar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,1
1272261053,Aditya Rajesh Jadhav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261165,Anshika Sharma,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261000,Ashwath Nitesh Gaonkar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261081,Chinmayee Jagdish Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261616,Dhruv Kalal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261098,Eeshita Mukesh Gurubhaiye,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261966,Ishan Samir Dalvi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261197,Khushi Manish Yermal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272262286,Manshi Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261091,Mohammed Shariq,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261730,Ovi Vivek Jahagirdar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261650,Pratham,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261533,Rishi Dilip Kumar Gogad,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272260971,Saksham Panchal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261747,Siddharth Singh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272260109,Sumit Sunil Lokhande,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261337,Suryavansh Bakshi,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272261436,Vaishnavi Rajendra Kale,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272260901,Yuvraj Soni,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272262471,Zahin Amir Pathan,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,2
1272260325,Aanya Sehgal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261367,Advika Kolharkar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261969,Anaya Avinash Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261686,Anvi Avinash Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261977,Aryan Bankat Dhakane,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261910,Atharv Niwrti Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261565,Atharva Atul Patil,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272260339,Ganta Arjun,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272262514,Gauri Naresh Yadav,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261647,Jay Jagdish Patel,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261713,Kunsh Sanjay Agarwal,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272260351,Naina Kakwani,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261708,Nilakshi Amol Deshmukh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261563,Poorvi Kothari,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261186,Priyam Dey,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261335,Sania Khurshid Ahmed Chaudhary,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261011,Shavez Parveez Shaikh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261623,Sneha Avinash Mahindkar,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261859,Tabish Imran Shaikh,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261235,Vedanta Sandeep Kanpile,B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science),12 - FY CSE AIDS,3
1272261263,Aayushi Vasantbhai Patel,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261605,Anika Chandra,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261372,Anvi Jain,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261319,Arush Gupta,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272260976,Aryan Gourish Suktekar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261360,Ayaan Firoj Attar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261894,Ayush Amol Warudkar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272260441,Catherine Jaboy Varghese,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272262290,Chaitanya Yogesh Jaipurkar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261522,Disha Patel,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272262263,Govind Mangilal Choudhari,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261130,Jaanhavi Harish Kotian,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261693,Jyotsav Singh,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261348,Kaustub Prasad Rao,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261550,Madhura Pradip Nandkar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272260602,Mohammed Ali Shaikh,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272262181,Mohammed Gorachwala,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272260904,Nirmit Pratik Patel,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272260376,Ojas Abhinandan Shah,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272260393,Paxton Luis Fernandes,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261394,Priyanshi Rakesh Rajkule,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1262260228,Raayna Gautam Wahi,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261758,Rujula Virdhaval Jadhav,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272262043,Sairaj Laxmanrao Dakhore,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272262254,Sawani Sambhaji Ambre,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261012,Shakshi Gupta,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1262260684,Shihij Kaushik,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261226,Sonde Kartik Dharmaraj,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261673,Tanmay Vaidya,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261703,Vedant Jain,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261858,Viraj Sachin Kundkar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272262127,Yashraj Deepak Swamy,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,1
1272261613,Aaryan Dhirajprasad Hanchanalkar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272262526,Aditya Umashankar Singh,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272262298,Anshul Jitendra Patil,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261441,Arush Amit Mahajan,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261865,Ayush Kumar Singh,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261094,Dev Suhas Harishchandre,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272262147,Dhruv Goyal,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261662,Harsha Vilas Adav,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261225,Janhavi Girish Dahiwale,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261393,Kalp Hiten Shah,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261943,Lavanya Hrishikesh Chaudhari,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261045,Meghana Thalakola,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261153,Om Suryakant Nalawade,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272262071,Parikshit Bhatt,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272260373,Pranav Mohan Agrawal,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261115,Rajdeep Sharad Naik,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272262231,Ritwik Raj,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261396,Rucha Pramod Ballal,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261468,Ryan Mike Dsouza,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261145,Samruddhi Sanjaykumar Salunke,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1262260747,Shivraj Udhav Dhepe,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272262209,Shloka Nilesh Amritkar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261649,Shreya Sandeep Gadhave,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261434,Snehal Dattatray Chopdar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261583,Swayam Dinkar Dakare,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272262420,Tanvesha Venkat Bhosle,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261112,Vanshika Rathore,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261837,Vidya Sunil Vaid,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261378,Yahvi Aditya Modi,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261940,Yashaswa Goel,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,2
1272261290,Aayusha Dilip Lekule,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272262137,Adityavardhan Ashish Bopche,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261571,Anam Javed,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272262177,Annie Tiwari,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261628,Anujay Jaynath Singh,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272260973,Arnav Sunil Shinde,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261350,Aryaman Ashutosh Dubey,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261870,Atharv Prashant Ugile,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261020,Atharva Vinus Karnwal,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1262261311,Ayush Avinash Talele,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261362,Ayush Deb,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261315,Devanshi Chetia,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261001,Ishita Neel Patil,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261806,Janvi Vishwanath Sanap,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261325,Kashish Amol Mudholkar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272260650,Lavanya Vyas,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261945,Lokesh Rajesh Sonekar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261323,Mohammad Yasin Mithwale,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272260348,Nirmal Byju Iyyani,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272260992,Param Vikas Jain,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272260428,Prince Choudhary,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261161,Razeen Riyas,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261073,Rujuka Abhijit Danke,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272260459,Rylan Rodrigues,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261519,Saumya Saumin Patel,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261970,Shubhanshu Kumar Singh,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261759,Shubhra Shashikant Tiwari,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261588,Soham Jyotiba Kumbhar,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261851,Tanishq Gajanan Gunjal,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261694,Vedansh Agarwal,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261804,Vignesh Prakash Poojari,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272261715,Yashaswini Pathak,B.Tech Computer Science and Engineering (Cyber Security & Forensics),13 - FY CSE CSF,3
1272260996,Aarya Kedar Borkar,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261447,Aditi Rakesh Kadam,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272262192,Akshat Singh,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261212,Anshuman Behera,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261349,Arush Ashish Gupta,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261756,Dakshesh Sharma,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272262333,Dhruv Jain,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272260661,Hitansh Chandan Jain,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261182,Kaavya Sundaresan,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261818,Kshitij Ramdas Ubhe,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272262322,Maroushka Reginald Mendes,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261539,Mayank Maheshkumar Jain,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272260662,Nishita Sharma,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261303,Riya Rahul Jadhav,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261093,Sai Pranav Anil Attili,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261782,Sanskriti Mohanta,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261231,Shreyas Rajendra Yelalwar,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261341,Siddhi Bansal,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272262426,Sushant Rameshwar Mugal,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261925,Swasti Anil Patil,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261819,Ujjwal Kumar Singh,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1272261655,Yuvraj Gupta,B.Tech Computer Science and Engineering (Cloud Computing),14 - FY CSE CLOUD,1
1262261622,Aaditya Modi,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262356,Akshata Sanjay Nikam,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262548,Alina Anthonamit Gonsalves,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261724,Anukalp Tibrewal,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262089,Anushree Ankush Sawant,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262063,Arya Manish Tappe,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261899,Aryan Chetan Rasal,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262002,Aryan Singh,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261502,Athashri Prakash Thakre,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262260680,Hitarth Chintan Shukla,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261634,Janhavi Sunil Bhise,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262375,Kaushik Surendra Hiware,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262141,Keyur Pramod Chaudhari,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261214,Komya Kirti Kumar Patel,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261609,Maithili Abhijeet Khiratkar,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262260340,Megha Yogeshkumar Modi,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261129,Neha Malatesh Mariyappalavar,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262408,Raksha Anand Gajbi,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262260337,Ronak Sunil Sharma,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262260166,Saumil Ulhas Ranade,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261691,Tanishka Sameer Rajopadhye,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261071,Urvaraj Sunil Jadhav,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262001,Vedant Singh Chauhan,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261796,Veer Jain,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262262411,Vishrut Rahul Vaishampayan,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261320,Yug Utpal Panchal,B.Tech Electronics and Communication Engineering,15 - FY ECE,1
1262261822,Aayush Pawar,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),17 - FY ECE AIML,1
1262261438,Aditya Amol Utpat,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),17 - FY ECE AIML,1
1262261621,Agrima Belchandan,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),17 - FY ECE AIML,1
1262262287,Ahmed Aazim Shahid,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),17 - FY ECE AIML,1
1262261326,Anushka Amol Punde,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),17 - FY ECE AIML,1
1262262210,Anushka Pradip Shimpi,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),17 - FY ECE AIML,1
1262262051,Arpit Gupta,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),17 - FY ECE AIML,1
1262261353,Atharva Bhadale Bhadale,B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning),17 - FY ECE AIML,1
1262261507,Aarush Manjit Jadhav,B.Tech Electrical & Computer Engineering,19 - FY E&CE,1
1262261343,Adarsh Pradhan,B.Tech Electrical & Computer Engineering,19 - FY E&CE,1
1262260526,Akshay Tejpal Choudhary,B.Tech Electrical & Computer Engineering,19 - FY E&CE,1
1262261423,Anant Sharma,B.Tech Electrical & Computer Engineering,19 - FY E&CE,1
1262260702,Abhishek Kumar Singh,B.Tech Electronics (Semiconductor and VLSI Design),20 - FY SEM VLSI,1
1262261699,Adyut Kumar,B.Tech Electronics (Semiconductor and VLSI Design),20 - FY SEM VLSI,1
1262262248,Ananya Pandey,B.Tech Electronics (Semiconductor and VLSI Design),20 - FY SEM VLSI,1
1262261161,Abhir Mahesh Deshpande,B.Tech Renewable Energy Engineering,21 - FY REN ENE,1
1262260500,Adwaiya Tushar Narkhede,B.Tech Renewable Energy Engineering,21 - FY REN ENE,1
1262261575,Arya Ajay Daundkar,B.Tech Renewable Energy Engineering,21 - FY REN ENE,1
1262260984,Aadityaraje Sanjay Desai,B.Tech Mechanical Engineering,22 - FY MECH,1
1262261080,Aditya Sudhir Bharambe,B.Tech Mechanical Engineering,22 - FY MECH,1
1262262396,Adwait Nikhil Lonikar,B.Tech Mechanical Engineering,22 - FY MECH,1
1262262611,Aaditya Nilesh Sangwai,B.Tech Mechanical Engineering,23 - FY MECH,1
1262261186,Aashman Rupesh Musale,B.Tech Mechanical Engineering,23 - FY MECH,1
1262261017,Aarein Gaurav Karhadkar,B.Tech Mechanical Engineering (Robotics and Automation),24 - FY MECH ROBO,1
1262261985,Aaryan Dilip Gangras,B.Tech Mechanical Engineering (Robotics and Automation),24 - FY MECH ROBO,1
1262261864,Abhay Dinesh Pardeshi,B.Tech Mechanical Engineering (Robotics and Automation),25 - FY MECH ROBO,1
1262261091,Akanksha Shivalingam Bale,B.Tech Chemical Engineering,26 - FY CHEM,1
1262261079,Arjun Anup Arbale,B.Tech Chemical Engineering,26 - FY CHEM,1
1262260973,Aadhitiya Ashmit Kulai,B.Tech Materials Science & Engineering,27 - FY MSE,1
1262262642,Amasio Toca Tchissapa Chicolassonhi,B.Tech Petroleum Engineering,28 - FY PETRO,1
1262260387,Aadya,B.Tech Civil Engineering,29 - FY CIVIL,1
1262261149,Aayush Jagdale,B.Tech Civil Engineering (Smart Infrastructure & Construction),30 - FY CIVIL SMART,1
1262260660,Aahna Shah,B.Tech Bioengineering,31 - FY BIO,1
1262260644,Aamena Shabbir Typist,B.Tech Bioengineering,32 - FY BIO,1`;

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

// Parse students
const studentLines = rawStudentCsv.trim().split('\n').slice(1);
const students = studentLines.map(line => {
  const parts = line.split(',');
  return {
    prn: parts[0]?.trim(),
    name: parts[1]?.trim(),
    branch: parts[2]?.trim(),
    division: parts[3]?.trim(),
    batch: parseInt(parts[4]?.trim() || '1')
  };
}).filter(s => s.prn && s.name);

// Parse courses
const courseLines = rawCoursesCsv.trim().split('\n').slice(1);
const courses = courseLines.map((line, idx) => {
  const parts = line.split(',');
  return {
    id: `course-${idx + 1}`,
    code: parts[0]?.trim(),
    name: parts[1]?.trim()?.replace(/^"|"$/g, ''),
    credits: parseInt(parts[2]?.trim() || '3')
  };
}).filter(c => c.code && c.name);

console.log(`Parsed ${students.length} students and ${courses.length} courses.`);

const output = { students, courses };
fs.writeFileSync(path.join(__dirname, 'parsedRaw.json'), JSON.stringify(output, null, 2));
console.log('Saved parsedRaw.json');
