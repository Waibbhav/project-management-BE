'use strict';

let FormControls = function () {
    let addNewUserValidation = function () {
        $("#add-new-user").validate({
            rules: {
                fullName: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                },
                business_type: {
                    required: true
                },
            },
            messages: {
                fullName: {
                    required: "Please enter fullname",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid fullname"
                },
                email: {
                    required: "Please enter email",
                    email: "Please enter a valid email"
                },
                business_type: {
                    required: "Please select business type"
                },
            },
            invalidHandler: function (event, validator) {
            },
            submitHandler: function (form) {
                // if ($('#phone').val()) {
                //     const phoneInputField = document.querySelector("#phone");
                //     const phoneInput = window.intlTelInput(phoneInputField, {
                //         preferredCountries: ["us", "co", "in", "de"],
                //         utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                //     });
                //     let country = phoneInput.getSelectedCountryData();
                //     if (country && country.dialCode) {
                //         $('#countryCode').val(country.dialCode);
                //     }
                // }

                $(form).submit();
            }
        });
    }

    let editUserValidation = function () {
        $("#editUserForm").validate({
            rules: {
                fullName: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                },
                business_type: {
                    required: true
                },
            },
            messages: {
                fullName: {
                    required: "Please enter fullname",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid fullname"
                },
                email: {
                    required: "Please enter email",
                    email: "Please enter a valid email"
                },
                business_type: {
                    required: "Please select business type"
                },
            },
            invalidHandler: function (event, validator) {
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    let adminAcntFrmValidation = function () {
        $("#adminAcntFrm").validate({
            rules: {
                first_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                last_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                first_name: {
                    required: "Please enter your first name",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid firstname"
                },
                last_name: {
                    required: "Please enter your last name",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid lastname"
                },
                email: {
                    required: "Please enter your email",
                    email: "Please enter a valid email"
                }
            },
            invalidHandler: function (event, validator) {
            },
            submitHandler: function (form) {
                $(form).submit();
            }
        });
    }

    let adminChangePasswordValidation = function () {
        $("#adminChangePassword").validate({
            rules: {
                'old_password': {
                    required: true
                },
                'password': {
                    required: true,
                    minlength: 8
                },
                'confirm-new-password': {
                    required: true,
                    minlength: 8,
                    equalTo: '#account-new-password'
                }
            },
            messages: {
                'old_password': {
                    required: 'Enter old password'
                },
                'password': {
                    required: 'Enter new password',
                    minlength: 'Enter at least 8 characters'
                },
                'confirm-new-password': {
                    required: 'Please confirm new password',
                    minlength: 'Enter at least 8 characters',
                    equalTo: 'The password and its confirm are not the same'
                }
            },
            invalidHandler: function (event, validator) {
            },
            submitHandler: function (form) {
                $(form).submit();
            }
        });
    }

    let formChangePasswordValidation = function () {
        $("#formChangePassword").validate({
            rules: {
                new_password: {
                    required: true,
                    required: true,
                    pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                    minlength: 8
                },
                confirm_password: {
                    required: true,
                    minlength: 8,
                    equalTo: '#new_password'
                }
            },
            messages: {
                new_password: {
                    required: 'Enter new password',
                    pattern: "Please meet password field's minimum requirements",
                    minlength: 'Enter at least 8 characters'
                },
                confirm_password: {
                    required: 'Please confirm new password',
                    minlength: 'Enter at least 8 characters',
                    equalTo: 'The password and confirm password are not same'
                }
            },
            invalidHandler: function (event, validator) {
            },
            submitHandler: function (form) {
                $(form).submit();
            }
        });
    }

    let addNewCmsValidation = function () {
        $("#add-new-cms").validate({
            rules: {
                'title': {
                    required: true,
                    minlength: 3
                }
            },
            messages: {
                'title': {
                    required: 'Title is required',
                    minlength: "Please enter a valid title"
                }
            },
            invalidHandler: function (event, validator) {
            },
            submitHandler: function (form) {
                $(form).submit();
            }
        });
    }


    let addNewSupplierValidation = function () {
        $("#add-new-supplier").validate({
            rules: {
                fullName: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                },
                account_type: {
                    required: true
                },
            },
            messages: {
                fullName: {
                    required: "Please enter fullname",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid fullname"
                },
                email: {
                    required: "Please enter email",
                    email: "Please enter a valid email"
                },
                account_type: {
                    required: "Please select account type"
                },
            },
            invalidHandler: function (event, validator) {
            },
            submitHandler: function (form) {
                $(form).submit();
            }
        });
    }


    let addNewAccountTypeValidation = function () {
        $("#add-new-acc-types").validate({
            rules: {
                title: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                description: {
                    required: true
                }
            },
            messages: {
                title: {
                    required: "Please enter title",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid title"
                },
                description: {
                    required: "Please enter description"
                }
            },
            invalidHandler: function (event, validator) {
            },
            submitHandler: function (form) {
                $(form).submit();
            }
        });
    }

    return {
        init: function () {
            addNewUserValidation();
            adminAcntFrmValidation();
            adminChangePasswordValidation();
            formChangePasswordValidation();
            addNewCmsValidation();
            editUserValidation();
            addNewSupplierValidation();
            addNewAccountTypeValidation();
        }
    };
}();

// $.validator.addMethod("phone", function(value, element) {
//     const phoneInputField = document.querySelector('#' + $(element).attr('id'));
//     const phoneInput = window.intlTelInput(phoneInputField, {
//         preferredCountries: ["us", "co", "in", "de"],
//         utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
//     });
//     let country = phoneInput.getSelectedCountryData();
//     if (country && country.iso2) {
//         // let number = phoneInput.getNumber();
//         // let phoneNum = number.replace('+' + country.dialCode, '').trim();
//         // phoneInput.setNumber(phoneNum);
//         // phoneInput.setCountry(country.iso2);
//     }
//     return this.optional( element ) || phoneInput.isValidNumber();
// }, 'Please enter a valid phone number.');
// Form Validation Initialize
$(document).ready(function () {
    FormControls.init();
});

