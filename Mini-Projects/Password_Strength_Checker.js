// Password Strength Checker

function checkPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    let result;

    if (strength <= 2) {
        result = "Weak 🔴";
    } else if (strength === 3 || strength === 4) {
        result = "Medium 🟡";
    } else {
        result = "Strong 🟢";
    }

    console.log("Password:", password);
    console.log("Strength:", result);
}

// Test
checkPasswordStrength("Hello123");
checkPasswordStrength("hello");
checkPasswordStrength("Him@2026Secure");