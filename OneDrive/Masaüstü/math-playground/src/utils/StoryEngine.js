
// StoryEngine.js

const SUBJECTS = [
    { name: "Ali", gender: "m" },
    { name: "Ayşe", gender: "f" },
    { name: "Mehmet", gender: "m" },
    { name: "Zeynep", gender: "f" },
    { name: "Can", gender: "m" },
    { name: "Elif", gender: "f" }
];

const OBJECTS = [
    { name: "elma", plural: "elma", emoji: "🍎" },
    { name: "top", plural: "top", emoji: "⚽" },
    { name: "kalem", plural: "kalem", emoji: "✏️" },
    { name: "şeker", plural: "şeker", emoji: "🍬" },
    { name: "yıldız", plural: "yıldız", emoji: "⭐" },
    { name: "balon", plural: "balon", emoji: "🎈" }
];

const PLACES = [
    "bahçede",
    "okulda",
    "parkta",
    "marketten",
    "evde"
];

export const generateProblem = (difficulty = 'hard') => {
    // Decide operation: 0 for addition, 1 for subtraction
    const isAddition = Math.random() > 0.5;

    let num1, num2, answer;

    if (difficulty === 'easy') {
        // Easy: One 2-digit number (10-90) and one 1-digit number (1-9)
        if (isAddition) {
            num1 = Math.floor(Math.random() * 80) + 10; // 10-89
            num2 = Math.floor(Math.random() * 9) + 1;   // 1-9
            answer = num1 + num2;
        } else {
            // Subtraction: 2-digit - 1-digit
            num1 = Math.floor(Math.random() * 80) + 10; // 10-89
            num2 = Math.floor(Math.random() * 9) + 1;   // 1-9
            // Ensure num1 > num2
            if (num2 >= num1) num1 = num2 + 1;
            answer = num1 - num2;
        }
    } else {
        // Hard: Two 2-digit numbers, sum <= 100
        if (isAddition) {
            // First number 10-89
            num1 = Math.floor(Math.random() * 80) + 10;
            // Second number 10 to (100 - num1)
            const maxNum2 = 100 - num1;
            if (maxNum2 < 10) {
                // Fallback if num1 is too large (e.g. 95), though logic above prevents >89 usually
                num1 = 50;
                num2 = 40;
            } else {
                num2 = Math.floor(Math.random() * (maxNum2 - 10 + 1)) + 10;
            }
            answer = num1 + num2;
        } else {
            // Subtraction: Two 2-digit numbers
            // Min result should be positive.
            num1 = Math.floor(Math.random() * 80) + 20; // 20-99
            // num2 must be 2-digit (>=10) and less than num1
            num2 = Math.floor(Math.random() * (num1 - 10 - 10 + 1)) + 10;
            answer = num1 - num2;
        }
    }

    const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const object = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    const place = PLACES[Math.floor(Math.random() * PLACES.length)];

    let storyText = "";
    let questionText = "";
    let method = ""; // "make10", "doubles", "simple"

    if (isAddition) {
        storyText = `${subject.name} ${place} ${num1} tane ${object.name} buldu. Sonra arkadaşı ona ${num2} tane daha ${object.name} verdi.`;
        questionText = `Toplam kaç tane ${object.name} oldu?`;

        // Determine method
        if (num1 + num2 > 10 && num1 < 10 && num2 < 10) {
            method = "make10";
        } else if (num1 === num2) {
            method = "doubles";
        } else if (num1 === num2 + 1 || num1 === num2 - 1) {
            method = "near_doubles";
        } else {
            method = "simple_counting";
        }

    } else {
        storyText = `${subject.name} ${place} ${num1} tane ${object.name} ile oynuyordu. ${num2} tanesini kaybetti.`;
        questionText = `Geriye kaç tane ${object.name} kaldı?`;

        if (num1 > 10 && num1 - num2 < 10) {
            method = "back_to_10";
        } else {
            method = "simple_subtraction";
        }
    }

    return {
        type: isAddition ? "addition" : "subtraction",
        num1,
        num2,
        answer,
        storyText,
        questionText,
        object,
        subject,
        method
    };
};

export const getHint = (problem) => {
    const { num1, num2, type } = problem;

    if (type === 'addition') {
        // Strategy: Split Tens and Ones (for 2-digit numbers)
        if (num1 >= 10 && num2 >= 10) {
            return `💡 İpucu: Onlukları ve birlikleri ayrı toplayabilirsin. Önce ${Math.floor(num1 / 10) * 10} ile ${Math.floor(num2 / 10) * 10} sayılarını topla, sonra birlikleri ekle.`;
        }
        // Strategy: Make 10 (for sums crossing 10)
        if (num1 < 10 && num2 < 10 && num1 + num2 > 10) {
            const needed = 10 - Math.max(num1, num2);
            const big = Math.max(num1, num2);
            return `💡 İpucu: ${big} sayısını 10 yapmak için kaç lazım? Diğer sayıdan o kadar alıp ${big}'e verelim.`;
        }
        // Strategy: Doubles
        if (num1 === num2) {
            return `💡 İpucu: İki sayı da aynı! ${num1} + ${num1} işlemini hatırlıyor musun?`;
        }
        // Default
        return `💡 İpucu: Büyük sayı olan ${Math.max(num1, num2)}'i aklında tut, diğerini üzerine ekle.`;
    } else {
        // Subtraction
        // Strategy: Split Tens (for 2-digit numbers)
        if (num1 >= 20 && num2 >= 10) {
            return `💡 İpucu: Önce onlukları çıkarabilirsin. ${Math.floor(num1 / 10) * 10}'dan ${Math.floor(num2 / 10) * 10} çıkar, sonra birlikleri hallet.`;
        }
        // Strategy: Back to 10
        if (num1 > 10 && num1 < 20 && num1 - num2 < 10) {
            const downTo10 = num1 - 10;
            return `💡 İpucu: Önce 10'a inelim. ${num1}'den ${downTo10} çıkarırsak 10 kalır. Sonra kalanı 10'dan çıkar.`;
        }
        // Default
        return `💡 İpucu: ${num1} sayısından geriye doğru ${num2} tane sayabilirsin.`;
    }
};

export const getExplanation = (problem) => {
    const { num1, num2, answer, method, type } = problem;

    if (type === "addition") {
        if (num1 >= 10 && num2 >= 10) {
            const tens1 = Math.floor(num1 / 10) * 10;
            const ones1 = num1 % 10;
            const tens2 = Math.floor(num2 / 10) * 10;
            const ones2 = num2 % 10;
            return `Harika! Şöyle yapabiliriz: Onlukları topladık (${tens1} + ${tens2} = ${tens1 + tens2}). Sonra birlikleri topladık (${ones1} + ${ones2} = ${ones1 + ones2}). Hepsini birleştirince ${answer} eder!`;
        }
        if (method === "make10" || (num1 + num2 > 10 && num1 < 10)) {
            const needed = 10 - Math.max(num1, num2);
            const big = Math.max(num1, num2);
            const small = Math.min(num1, num2);
            const left = small - needed;
            return `Büyük sayı ${big}. Onu 10 yapmak için ${needed} lazım. Küçük sayıdan ${needed} alıp ona verdik. Geriye ${left} kaldı. 10 ile ${left} toplarsak ${answer} eder!`;
        }
        if (method === "doubles") {
            return `İkisi de aynı! ${num1} ile ${num1} toplanınca ${answer} eder. Bunu ezbere bilebilirsin!`;
        }
        if (method === "near_doubles") {
            const small = Math.min(num1, num2);
            return `Bu sayılar birbirine çok yakın! ${small} ile ${small} toplarsak ${small * 2} eder. Bu sayı ondan sadece 1 fazla. Yani cevap ${small * 2} + 1 = ${answer}!`;
        }
        return `${num1} ile ${num2} toplandığında ${answer} eder. 5'erli gruplar halinde düşünmek işini kolaylaştırabilir!`;
    } else {
        // Subtraction
        if (num1 >= 20 && num2 >= 10) {
            const tens1 = Math.floor(num1 / 10) * 10;
            const tens2 = Math.floor(num2 / 10) * 10;
            return `Süper! ${tens1}'den ${tens2} çıkardık, sonra kalan birlikleri hesapladık. Sonuç ${answer}!`;
        }
        if (method === "back_to_10" || (num1 > 10 && num1 < 20 && num1 - num2 < 10)) {
            const downTo10 = num1 - 10;
            const remaining = num2 - downTo10;
            return `Önce 10'a indik. ${num1}'den ${downTo10} çıkardık, 10 kaldı. Çıkarmamız gereken ${num2} idi, geriye ${remaining} daha çıkardık. 10'dan ${remaining} çıkınca ${answer} kalır.`;
        }
        return `${num1} sayısından ${num2} çıkınca ${answer} kalır.`;
    }
};
