/*
 * Copyright (C) 2013 peredur.net
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function formhash_login(form, password) {
    // Create a new element input, this will be our hashed password field.
    var p = document.createElement("input");

    // Add the new element to our form.
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);

    // Make sure the plaintext password doesn't get sent.
    password.value = "";

    // Finally submit the form.
    form.submit();
}

function formhash_delete(form) {
    let timestamp_elements = document.getElementsByClassName("date");
    let delete_model_elements = document.getElementsByClassName("table-checkbox");
    let delete_models = [];
    let itemCount = 0;
    let model_checked = false;

    // Extract Deletion Dates for Checked Entries
    for (let i = 0; i < delete_model_elements.length; i++) {
      if (delete_model_elements[i].checked == true) {
        let p_date = document.createElement("input");
        p_date.name = "date[" + itemCount + "]";
        p_date.type = "hidden"
        p_date.value = timestamp_elements[i].textContent;
        delete_models.push(p_date);

        itemCount++;
        model_checked = true;
      }
    }

    if(!model_checked) {
      let no_model_checked = document.createElement("p");
      no_model_checked.textContent = "No Model Checked to Delete";
      document.getElementById('page-top-text').appendChild(no_model_checked);
      return;
    }
    // Create a new element input, this will be our hashed password field.
    let p = document.createElement("input");

    // // Add the new element to our form.
    // form.appendChild(p);
    // p.name = "delete";
    // p.type = "hidden";
    // p.value = delete_models;

    for (let j = 0; j < delete_models.length; j++) {
      form.appendChild(delete_models[j]);
    }

    // Finally submit the form.
    form.submit();
}

function regformhash(form, uid, email, password, conf) {
    // Check each field has a value
    if (uid.value == '' || email.value == '' || password.value == '' || conf.value == '') {
        alert('You must provide all the requested details. Please try again');
        return false;
    }

    // Check the username
    re = /^\w+$/;
    if(!re.test(form.username.value)) {
        alert("Username must contain only letters, numbers and underscores. Please try again");
        form.username.focus();
        return false;
    }

    // Check that the password is sufficiently long (min 6 chars)
    // The check is duplicated below, but this is included to give more
    // specific guidance to the user
    if (password.value.length < 6) {
        alert('Passwords must be at least 6 characters long.  Please try again');
        form.password.focus();
        return false;
    }

    // At least one number, one lowercase and one uppercase letter
    // At least six characters
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!re.test(password.value)) {
        alert('Passwords must contain at least one number, one lowercase and one uppercase letter.  Please try again');
        return false;
    }

    // Check password and confirmation are the same
    if (password.value != conf.value) {
        alert('Your password and confirmation do not match. Please try again');
        form.password.focus();
        return false;
    }

    // Create a new element input, this will be our hashed password field.
    var p = document.createElement("input");

    // Add the new element to our form.
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);

    // Make sure the plaintext password doesn't get sent.
    password.value = "";
    conf.value = "";

    // Finally submit the form.
    form.submit();
    return true;
}
