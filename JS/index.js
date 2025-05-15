function hideAllSections() {
  $("#meals, #searchSection, #categoriesSection, #areaSection, #ingredientsSection, #mealDetails, #contactSection").addClass("d-none");
}

//! Loading Screen
jQuery(function () {
  $(".loading-screen").fadeOut(2000, function () {
    $("body").css({ overflow: "auto" });
  });
});

//! Side Navbar
const upperOffset = $(".upper").innerWidth();
$(".sideNav").css({ left: `-${upperOffset}px` });

let isShown = false;

$(".gear-icon").on("click", function () {
  if (isShown == true) {
    $(".sideNav").animate({ left: `-${upperOffset}px` }, 1000);
    $(".toggle-icon").addClass("fa-gear fa-spin");
    $(".toggle-icon").removeClass("fa-xmark");
    isShown = false;
  } else {
    $(".sideNav").animate({ left: `0` }, 1000);
    $(".toggle-icon").removeClass("fa-gear fa-spin");
    $(".toggle-icon").addClass("fa-xmark");
    isShown = true;
  }
});

//! Body Content
function getMeals() {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
    .then((res) => res.json())
    .then((data) => {
      display(data.meals || []);
    });
}

function display(meals, target = "rowData") {
  let cartoona = "";
  for (let i = 0; i < meals.length; i++) {
    cartoona += `<div class="col-md-3 mt-4">
                <div class="card meal-card rounded-4 overflow-hidden" data-mealid="${meals[i].idMeal}">
                <img src="${meals[i].strMealThumb}" class="card-img-top rounded-4" alt="${meals[i].strMeal}">
                <div class="meal-overlay d-flex align-items-center justify-content-center rounded-4">
            <h5 class="meal-name text-white fw-bold m-0">${meals[i].strMeal}</h5>
          </div>
        </div>
      </div>`;
  }
  document.getElementById(target).innerHTML = cartoona;

  // ✅ Event Listener to show details
  $(".meal-card").on("click", function () {
    let mealId = $(this).data("mealid");
    getMealDetails(mealId);
  });
}

window.onload = function () {
  getMeals();
};

//! Meal Details Page
function getMealDetails(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
      if (data.meals && data.meals.length > 0) {
        showMealDetails(data.meals[0]);
      } else {
        console.error("Meal not found!");
      }
    });
}

function showMealDetails(meal) {
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<li class="badge bg-info text-dark m-1 p-2">${measure} ${ingredient}</li>`;
    }
  }

  let tags = meal.strTags ? meal.strTags.split(",").map(t => `<span class="badge bg-warning text-dark m-1">${t}</span>`).join("") : "";

  let html = `
    <div class="col-md-4">
      <img src="${meal.strMealThumb}" class="w-100 rounded-3 mb-3">
      <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
      <h4>Instructions</h4>
      <p>${meal.strInstructions}</p>
      <ul class="list-unstyled">
        <li><strong>Area:</strong> ${meal.strArea}</li>
        <li><strong>Category:</strong> ${meal.strCategory}</li>
      </ul>
      <h5>Ingredients</h5>
      <ul class="list-unstyled d-flex flex-wrap">${ingredients}</ul>
      <h5>Tags</h5>
      <div>${tags}</div>
      <div class="mt-3">
        <a href="${meal.strSource}" target="_blank" class="btn btn-success">Source</a>
        <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">YouTube</a>
      </div>
    </div>`;

  hideAllSections();
  $("#mealDetails").removeClass("d-none");
  $("#mealDetailsContent").html(html);
}

//! Search Page
$("#searchLink").on("click", function (e) {
  e.preventDefault();
  hideAllSections();
  $("#searchSection").removeClass("d-none");

  if (isShown) {
    $(".sideNav").animate({ left: `-${upperOffset}px` }, 1000);
    $(".toggle-icon").addClass("fa-gear fa-spin").removeClass("fa-xmark");
    isShown = false;
  }
});

//?? Search by Name
$("#searchByName").on("keyup", function () {
  let name = $(this).val();
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then((res) => res.json())
    .then((data) => display(data.meals || [], "searchResults"));
});

//?? Search by First Letter
$("#searchByLetter").on("keyup", function () {
  let letter = $(this).val().charAt(0); // First Letter Only
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    .then((res) => res.json())
    .then((data) => display(data.meals || [], "searchResults"));
});

//! Categories Page
$("#categoriesLink").on("click", function (e) {
  e.preventDefault();
  hideAllSections();
  $("#categoriesSection").removeClass("d-none");

  if (isShown) {
    $(".sideNav").animate({ left: `-${upperOffset}px` }, 1000);
    $(".toggle-icon").addClass("fa-gear fa-spin").removeClass("fa-xmark");
    isShown = false;
  }
  getCategories();
});

function getCategories() {
  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((err) => {
      $(".loading-screen").fadeOut();
    });
}

function displayCategories(categories) {
  let cartoona = "";
  for (let i = 0; i < categories.length; i++) {
    let description = categories[i].strCategoryDescription;
    if (description.length > 100) {
      description = description.substring(0, 100) + "...";
    }

    cartoona += ` <div class="col-md-3">
        <div class="card category-card my-4 text-center p-5 bg-transparent border-0 rounded-4 overflow-hidden position-relative" data-category="${categories[i].strCategory}">
          <img src="${categories[i].strCategoryThumb}" class="w-100 rounded-3 mb-2" alt="${categories[i].strCategory}">
          <div class="meal-overlay d-flex flex-column align-items-center justify-content-center rounded-4 p-2">
            <h5 class="meal-name fs-3 fw-bold m-0">${categories[i].strCategory}</h5>
            <p class="meal-name text-white fs-6 mt-3">${description}</p>
          </div>
        </div>
      </div>`;
  }
  document.getElementById("categoriesList").innerHTML = cartoona;

  $(".category-card").on("click", function () {
    let category = $(this).data("category");
    getMealsByCategory(category);
  });
}

function getMealsByCategory(category) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((res) => res.json())
    .then((data) => {
      display(data.meals);
      hideAllSections();
      $("#meals").removeClass("d-none");

      display(data.meals, "rowData");
    })
    .catch((err) => {
      console.error("Error fetching meals by category", err);
      $(".loading-screen").fadeOut();
    });
}

//! Area Page
$("#areaLink").on("click", function (e) {
  e.preventDefault();
  hideAllSections();
  $("#areaSection").removeClass("d-none");

  if (isShown) {
    $(".sideNav").animate({ left: `-${upperOffset}px` }, 1000);
    $(".toggle-icon").addClass("fa-gear fa-spin").removeClass("fa-xmark");
    isShown = false;
  }

  getAreas(); // استدعاء الدوال
});

function getAreas() {
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((res) => res.json())
    .then((data) => displayAreas(data.meals))
    .catch((err) => console.error("Error fetching areas:", err));
}

function displayAreas(areas) {
  let cartoona = "";
  areas.forEach((area) => {
    let flag = getFlagEmoji(area.strArea); // العلم

    cartoona += `
      <div class="col-md-3 my-3">
        <div class="card area-card text-center p-4 rounded-4 shadow-sm border-0 position-relative bg-glass" data-area="${area.strArea}" style="cursor: pointer; transition: transform 0.3s ease;">
          <div class="area-icon mb-2" style="font-size: 3rem;">${flag}</div>
          <h5 class="fw-bold fs-4">${area.strArea}</h5>
          <p class="text-muted">Discover meals from <span class="text-primary">${area.strArea}</span> 🍽</p>
        </div>
      </div>`;
  });

  $("#areaContainer").html(cartoona);

  $(".area-card").on("click", function () {
    let area = $(this).data("area");
    getMealsByArea(area);
  });
}

// Return all meals for each area
function getMealsByArea(area) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    .then((res) => res.json())
    .then((data) => {
      display(data.meals, "rowData");
      hideAllSections();
      $("#meals").removeClass("d-none");
    })
    .catch((err) => console.error("Error fetching meals by area:", err));
}

// تحويل اسم الدولة لرمز علم باستخدام Unicode Flags
function getFlagEmoji(country) {
  const countryCodes = {
    American: "US",
    British: "GB",
    Canadian: "CA",
    Chinese: "CN",
    Croatian: "HR",
    Dutch: "NL",
    Egyptian: "EG",
    Filipino: "PH",
    French: "FR",
    Greek: "GR",
    Indian: "IN",
    Irish: "IE",
    Italian: "IT",
    Jamaican: "JM",
    Japanese: "JP",
    Kenyan: "KE",
    Malaysian: "MY",
    Mexican: "MX",
    Moroccan: "MA",
    Polish: "PL",
    Portuguese: "PT",
    Russian: "RU",
    Spanish: "ES",
    Thai: "TH",
    Tunisian: "TN",
    Turkish: "TR",
    Unknown: "UN",
    Vietnamese: "VN",
  };

  let code = countryCodes[country] || "UN";
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
    .join("");
}

//! Ingredients Page
$("#ingredientsLink").on("click", function (e) {
  e.preventDefault();
  hideAllSections();
  $("#ingredientsSection").removeClass("d-none");

  if (isShown) {
    $(".sideNav").animate({ left: `-${upperOffset}px` }, 1000);
    $(".toggle-icon").addClass("fa-gear fa-spin").removeClass("fa-xmark");
    isShown = false;
  }

  getIngredients();
});

function getIngredients() {
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
    .then((res) => res.json())
    .then((data) => displayIngredients(data.meals.slice(0, 20))) // أول 20 مكون فقط
    .catch((err) => console.error("Error fetching ingredients:", err));
}

function displayIngredients(ingredients) {
  let cartoona = "";
  ingredients.forEach((ingredient) => {
    cartoona += `
      <div class="col-md-3 text-center">
        <div class="card ingredient-card p-4 rounded-4 bg-transparent border-0" data-ingredient="${
          ingredient.strIngredient
        }" style="cursor: pointer;">
          <i class="fa-solid fa-bowl-food fa-3x mb-3"></i>
          <h5 class="fw-bold">${ingredient.strIngredient}</h5>
          <p class="text-muted small">${
            ingredient.strDescription?.split(" ").slice(0, 10).join(" ") || ""
          }...</p>
        </div>
      </div>`;
  });

  $("#ingredientsContainer").html(cartoona);

  $(".ingredient-card").on("click", function () {
    let ingredient = $(this).data("ingredient");
    getMealsByIngredient(ingredient);
  });
}

function getMealsByIngredient(ingredient) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then((res) => res.json())
    .then((data) => {
      display(data.meals);
      hideAllSections();
      $("#meals").removeClass("d-none");
    })
    .catch((err) => console.error("Error fetching meals by ingredient:", err));
}

//! Contact US Page
$("#contactUsLink").on("click", function (e) {
  e.preventDefault();
  hideAllSections();
  $("#contactSection").removeClass("d-none");

  if (isShown) {
    $(".sideNav").animate({ left: `-${upperOffset}px` }, 1000);
    $(".toggle-icon").addClass("fa-gear fa-spin").removeClass("fa-xmark");
    isShown = false;
  }
});

// Regex Patterns
const regex = {
  name: /^[a-zA-Z ]+$/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  phone: /^(\+?\d{1,3})?\d{10,12}$/,
  age: /^(1[0-9]|[2-9][0-9]|100)$/,
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/
};

function validateInput(id, pattern) {
  const input = $(`#${id}`);
  const error = $(`#${id.replace("Input", "")}Error`);
  const isValid = pattern.test(input.val());

  input.toggleClass("is-valid", isValid);
  input.toggleClass("is-invalid", !isValid);
  if (error.length) error.toggleClass("d-none", isValid);

  return isValid;
}


function validateConfirmPassword() {
  const password = $("#passwordInput").val();
  const repassword = $("#repasswordInput").val();
  const match = password === repassword && password.length > 0;

  $("#repasswordInput").toggleClass("is-valid", match);
  $("#repasswordInput").toggleClass("is-invalid", !match);
  $("#repasswordError").toggleClass("d-none", match);

  return match;
}

function showMessage(message, duration = 3000) {
  const msgDiv = $("#formMessage");
  msgDiv.text(message);
  msgDiv.css("opacity", "1");
  msgDiv.show();

  setTimeout(() => {
    msgDiv.css("opacity", "0");
    setTimeout(() => msgDiv.hide(), 400);
  }, duration);
}

$("#contactForm input").on("input", function () {
  const id = $(this).attr("id");

  if (id === "repasswordInput") {
    validateConfirmPassword();
  } else {
    const key = id.replace("Input", ""); // nameInput → name
    if (regex[key]) {
      validateInput(id, regex[key]);
    }
  }

  // التحقق الصامت من كل الحقول عشان نعرف نفعّل الزر بس
  const isFormValid =
    regex.name.test($("#nameInput").val()) &&
    regex.email.test($("#emailInput").val()) &&
    regex.phone.test($("#phoneInput").val()) &&
    regex.age.test($("#ageInput").val()) &&
    regex.password.test($("#passwordInput").val()) &&
    $("#passwordInput").val() === $("#repasswordInput").val();

  $("#submitBtn").prop("disabled", !isFormValid);
});

$("#contactForm").on("submit", function (e) {
  e.preventDefault();
  showMessage("Form Submitted Successfully!");
  this.reset();
  $("input").removeClass("is-valid is-invalid");
  $("small.text-danger").addClass("d-none");
  $("#submitBtn").prop("disabled", true);
});

//! Home Button 
$("#homeBtn").on("click", function(e){
  e.preventDefault();
  hideAllSections();
  $("#meals").removeClass("d-none");

  if (typeof getMeals === "function") {
    getMeals();
  }

  if (isShown) {
    $(".sideNav").animate({ left: `-${upperOffset}px` }, 1000);
    $(".toggle-icon").addClass("fa-gear fa-spin").removeClass("fa-xmark");
    isShown = false;
  }
});

