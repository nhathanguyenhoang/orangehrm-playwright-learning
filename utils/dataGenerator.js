function generateUsername() {
  return `auto_user_${Date.now()}`;
}

function generatePassword() {
  return 'Password123!';
}

module.exports = {
  generateUsername,
  generatePassword,
};
