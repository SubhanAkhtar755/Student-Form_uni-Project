// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBToEkvxspqEQl4qBKu4OTJ8BcU_iqfWrw",
  authDomain: "login-form-34572.firebaseapp.com",
  projectId: "login-form-34572",
  storageBucket: "login-form-34572.appspot.com",
  messagingSenderId: "47566707376",
  appId: "1:47566707376:web:ab1abd7f8afcabef5bb975"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// 🔹 Save student data (password = document ID)
async function saveStudentData(studentData) {
  await db.collection("StudentForm").doc(studentData.password).set({
    firstName: studentData.firstName,
    lastName: studentData.lastName,
    gender: studentData.gender,
    email: studentData.email,
    phone: studentData.phone,
    password: studentData.password,  // ⚠️ sirf demo ke liye
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  console.log("✅ Saved student with password as ID:", studentData.password);
}

// Save student data (Firestore auto ID, password is just a field)
async function saveStudentData(studentData) {
  const docRef = await db.collection("StudentForm").add({
    ...studentData,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  console.log("Saved student with auto ID:", docRef.id);
}

// Get student by password
async function getStudentByPassword(password) {
  const snapshot = await db.collection("StudentForm")
    .where("password", "==", password)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

// Update student by password
async function updateStudentData(password, studentData) {
  const student = await getStudentByPassword(password);
  if (!student) throw new Error("No student found with this password");

  await db.collection("StudentForm").doc(student.id).update({
    ...studentData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  console.log("Updated student:", student.id);
}

// Delete student by password
async function deleteStudentData(password) {
  const student = await getStudentByPassword(password);
  if (!student) throw new Error("No student found with this password");

  await db.collection("StudentForm").doc(student.id).delete();
  console.log("Deleted student:", student.id);
}

// Get all students
async function getAllStudentData() {
  const snapshot = await db.collection("StudentForm").orderBy("timestamp", "desc").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
