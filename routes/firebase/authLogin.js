const {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} = require("firebase/auth");

const authLogin = async () => {
  const auth = getAuth();

  await setPersistence(auth, browserSessionPersistence);
  console.log("user login");
  await signInWithEmailAndPassword(
    auth,
    process.env.firebaseEmail,
    process.env.firebasePasswrod
  );
};
module.exports = authLogin;
