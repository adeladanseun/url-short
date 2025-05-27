const original_url_input = document.querySelector('.original-url').getElementsByTagName('input')[0]
original_url_input.classList.add('input-field')

const newPasswordWrapper = document.getElementById('newPasswordWrapper')
const originalPassword = document.querySelector('.originalPasswordWrapper').querySelector('input')
const changePasswordCheckbox = document.getElementById('changepassword')
const revealNewPassword = document.getElementById('newPasswordReveal')
const editAction = document.getElementById('editAction')
const deleteAction = document.getElementById('deleteAction')
const cancelAction = document.getElementById('cancelAction')
const form = document.querySelector('form')//document.getElementById('modification-form')
const removePassword = document.getElementById('unsetPassword')

function clearNewPasswords() {
    [...newPasswordWrapper.querySelectorAll('input')].forEach(input => {
        if ((input.type == 'password') || (input.type == 'text')) {
            input.value = ''
        }
    })
} 
function checkOriginalPassword() {
    if((originalPassword.value.trim().length > 0) || !originalPassword.required) {
        console.log('allowing')
        return true
    }
    return false
}
function checkNewPasswordEquality() {
    let password = undefined;
    let isEqual = true;
    [...newPasswordWrapper.querySelectorAll('input')].forEach(input => {
        if ((input.type == 'password') || (input.type == 'text')) {
            if(!password) {
                password = input.value
            }
            if((input.value != password)){ 
                isEqual = false
            }
        }
    })
    return isEqual

}

removePassword.addEventListener('change', () => {
    console.log(removePassword.checked)
    if (removePassword.checked) {
        changePasswordCheckbox.checked = false
        clearNewPasswords()
        newPasswordWrapper.classList.add('hide')
    }
})

changePasswordCheckbox.addEventListener('change', () => {
    if (changePasswordCheckbox.checked) {
        removePassword.checked = false
    }
    if (!newPasswordWrapper.classList.contains('hide')) {
        clearNewPasswords()
    };
    newPasswordWrapper.classList.contains('hide') ? newPasswordWrapper.classList.remove('hide') : newPasswordWrapper.classList.add('hide')
})

revealNewPassword.addEventListener('click', () => {
    [...document.querySelectorAll('input')].slice(2).forEach(input => {
        if (input.type == 'password' || input.type=='text'){
            input.type = input.type == 'password' ? 'text' : 'password'
        }
    })
})

deleteAction.addEventListener('click', () => {
    clearNewPasswords()
    if(checkOriginalPassword()) {
        return true
    }
    return false
})
editAction.addEventListener('click', (e) => {
    const isEqual = checkNewPasswordEquality()
    if(checkOriginalPassword() && isEqual) {
        return true
    }
    else if (!checkOriginalPassword()) {
        alert('Please enter your original password before you submit')
    }
    if (!isEqual) {
        alert('Please ensure new passwords fields are identical if you want to set a new one')
    }
    e.preventDefault()
    return false
})
/* form.addEventListener('submit', (e) => {
    
}) */