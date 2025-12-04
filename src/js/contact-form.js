// Получаем элементы формы
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = form.querySelector('.submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');

// Объект с полями и их правилами валидации
const fields = {
    name: {
        element: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: function(value) {
            if (!value.trim()) return 'Имя обязательно для заполнения';
            if (value.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
            if (!/^[а-яА-Яa-zA-Z\s]+$/.test(value)) return 'Имя может содержать только буквы';
            return '';
        }
    },
    email: {
        element: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: function(value) {
            if (!value.trim()) return 'Email обязателен для заполнения';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Введите корректный email';
            return '';
        }
    },
    phone: {
        element: document.getElementById('phone'),
        error: document.getElementById('phoneError'),
        validate: function(value) {
            if (value.trim() && !/^[\+]?[0-9\s\-\(\)]+$/.test(value)) {
                return 'Некорректный формат телефона';
            }
            return '';
        }
    },
    message: {
        element: document.getElementById('message'),
        error: document.getElementById('messageError'),
        validate: function(value) {
            if (!value.trim()) return 'Сообщение обязательно для заполнения';
            if (value.trim().length < 10) return 'Сообщение должно содержать минимум 10 символов';
            if (value.trim().length > 1000) return 'Сообщение слишком длинное (максимум 1000 символов)';
            return '';
        }
    },
    agreement: {
        element: document.getElementById('agreement'),
        error: document.getElementById('agreementError'),
        validate: function(checked) {
            if (!checked) return 'Необходимо согласие с политикой конфиденциальности';
            return '';
        }
    }
};

// Функция для отображения ошибки
function showError(fieldName, message) {
    const field = fields[fieldName];
    field.error.textContent = message;
    field.element.classList.add('error');
}

// Функция для скрытия ошибки
function hideError(fieldName) {
    const field = fields[fieldName];
    field.error.textContent = '';
    field.element.classList.remove('error');
}

// Функция валидации отдельного поля
function validateField(fieldName) {
    const field = fields[fieldName];
    let value;
    
    if (fieldName === 'agreement') {
        value = field.element.checked;
    } else {
        value = field.element.value;
    }
    
    const errorMessage = field.validate(value);
    
    if (errorMessage) {
        showError(fieldName, errorMessage);
        return false;
    } else {
        hideError(fieldName);
        return true;
    }
}

// Функция валидации всей формы
function validateForm() {
    let isValid = true;
    
    // Проверяем все поля
    Object.keys(fields).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Функция показа состояния загрузки
function setLoadingState(loading) {
    if (loading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Функция показа успешного сообщения
function showSuccess() {
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Плавное появление
    setTimeout(() => {
        successMessage.style.opacity = '1';
    }, 100);
}

// Имитация отправки формы (в реальном проекте здесь будет AJAX запрос)
function submitForm(formData) {
    return new Promise((resolve) => {
        // Имитируем задержку сервера
        setTimeout(() => {
            console.log('Данные формы:', Object.fromEntries(formData));
            resolve({ success: true });
        }, 2000);
    });
}

// Добавляем валидацию в реальном времени
Object.keys(fields).forEach(fieldName => {
    const field = fields[fieldName];
    
    // Валидация при потере фокуса
    field.element.addEventListener('blur', () => {
        validateField(fieldName);
    });
    
    // Скрытие ошибки при начале ввода
    if (fieldName !== 'agreement') {
        field.element.addEventListener('input', () => {
            if (field.error.textContent) {
                hideError(fieldName);
            }
        });
    } else {
        field.element.addEventListener('change', () => {
            if (field.error.textContent) {
                hideError(fieldName);
            }
        });
    }
});

// Обработчик отправки формы
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку
    
    // Валидируем форму
    if (!validateForm()) {
        // Фокусируемся на первом поле с ошибкой
        const firstErrorField = Object.keys(fields).find(fieldName => 
            fields[fieldName].error.textContent
        );
        if (firstErrorField) {
            fields[firstErrorField].element.focus();
        }
        return;
    }
    
    // Собираем данные формы
    const formData = new FormData(form);
    
    try {
        // Показываем состояние загрузки
        setLoadingState(true);
        
        // Отправляем форму
        const result = await submitForm(formData);
        
        if (result.success) {
            showSuccess();
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        alert('Произошла ошибка при отправке. Попробуйте еще раз.');
    } finally {
        setLoadingState(false);
    }
});

// Форматирование телефона при вводе (бонус!)
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('7')) {
        value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
    }
    
    e.target.value = value;
});