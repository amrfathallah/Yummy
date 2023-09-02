/// <reference types="../@types/jquery" />

let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;


$(function(){
    searchByName('').then(function(){
        $(".loading").fadeOut(300)
        $('body').css('overflow', 'auto')

    })
})

//!================================ sideNav ============================================

function openSideNav(){
    $('.side-nav-menu').animate({left : 0 }, 500)

    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}
function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    $(".links li").animate({
        top: 300
    }, 500)
}

closeSideNav()
$(".side-nav-menu i.open-close-icon").on('click' , () => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})


//!================================ Display Meals ==============================================

getMealsData()

async function getMealsData(){
    let https = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    let response = await https.json()
    response.meals
    displayMeals(response.meals)
}

function displayMeals(data) {
    let box = "";

    for (let i = 0; i < data.length; i++) {
        box += `
        <div class="col-md-3" id="mealImg">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${data[i].strMealThumb}" alt="meal" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}

async function getMealDetails(mealId) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    response = await response.json();

    displayMealDetails(response.meals[0])
    $(".loading-screen").fadeOut(300)

}



function displayMealDetails(MealDetails) {
    
    searchContainer.innerHTML = "";
    
    let recipes = ``
    for (let i = 0; i < 20; i++) {
        if(MealDetails[`strIngredient${i}`]){
            recipes += `<li class = " alert alert-info m-2 p-1" >${MealDetails[`strMeasure${i}`]} ${MealDetails[`strIngredient${i}`]}</li>`
        }
        
    }
    let tags = MealDetails.strTags?.split(',')
    if(!tags){
        tags = []
    }
    let tagStr = ``
    for (let i = 0; i < tags.length; i++) {
        tagStr += `<li class = "alert alert-danger m-2 p-1 " >${tags[i]}</li>`
        
    }


    let box = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${MealDetails.strMealThumb}"
                    alt="Meal">
                    <h2>${MealDetails.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${MealDetails.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${MealDetails.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${MealDetails.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${recipes}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagStr}
                </ul>

                <a target="_blank" href="${MealDetails.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${MealDetails.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = box
}


//!======================================== Search ===================================

$('.Search').on('click', function(){
    closeSideNav()
    $('#searchContainer').html(`
    <div class="row py-4 ">
    <div class="col-md-6 ">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input onkeyup="searchByLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
    </div>
</div>`)
$('#rowData').html('')
})

async function searchByName(name) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    response = await response.json()
    if (response.meals) {
        displayMeals(response.meals)
    }else{
        displayMeals([])
    }
    $(".loading-screen").fadeOut(300)

}

async function searchByLetter(letter){
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    letter == "" ? letter = "p" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    response = await response.json()
    if (response.meals) {
        displayMeals(response.meals)
    }else{
        displayMeals([])
    }
    $(".loading-screen").fadeOut(300)
    
}



//!======================================== Categories ===================================


$('.Categories').on('click', function(){
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    $.ajax({
        type: "GET",
        url: "https://www.themealdb.com/api/json/v1/1/categories.php",
        data: {},
        dataType: "json",
        success: function (response) {
      
        searchContainer.innerHTML = "";
        displayCategories(response.categories)
        $(".loading-screen").fadeOut(300)
    
        }
    });
})

function displayCategories(data) {
    closeSideNav()
    rowData.innerHTML = ""
    let box = "";

    for (let i = 0; i < data.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${data[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${data[i].strCategoryThumb}" alt="Meal" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${data[i].strCategory}</h3>
                        <p>${data[i].strCategoryDescription.split(' ').slice(0,20).join(' ')}</p>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}

//!======================================== display Categories meals ===================================

async function getCategoryMeals(category){
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let responce = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
     responce = await responce.json() 
     displayMeals( responce.meals.slice(0,20) )
     $(".loading-screen").fadeOut(300)
}

//!============================================ Areas ==================================================

$('.Area').on('click', function(){
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    $.ajax({
        type: "GET",
        url: "https://www.themealdb.com/api/json/v1/1/list.php?a=list",
        data: {},
        dataType: "json",
        success: function (response) {
       
        searchContainer.innerHTML = "";
        displayArea(response.meals)
        $(".loading-screen").fadeOut(300)
    
        }
    });
})

function displayArea(data){
    closeSideNav()
    let box = "";

    for (let i = 0; i < data.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${data[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${data[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box

}

//!======================================== display Area meals ===================================

async function getAreaMeals(Area){
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let responce = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area}`)
     responce = await responce.json() 
     displayMeals( responce.meals.slice(0,20) )
     $(".loading-screen").fadeOut(300)
}

//!======================================== Ingredients ==============================================

$('.Ingredients').on('click', function(){
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    $.ajax({
        type: "GET",
        url: "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
        data: {},
        dataType: "json",
        success: function (response) {
        
        searchContainer.innerHTML = "";
        displayIngredients(response.meals.slice(0,20))
        $(".loading-screen").fadeOut(300)
    
        }
    });
})
function displayIngredients(data) {
    closeSideNav()
    let box = "";

    for (let i = 0; i < data.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${data[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${data[i].strIngredient}</h3>
                        <p>${data[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}


//!======================================== display Ingredients meals ===================================

async function getIngredientsMeals(Ingredient){
    closeSideNav()
    rowData.innerHTML = ""
    
    $(".loading-screen").fadeIn(300)
    let responce = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredient}`)
     responce = await responce.json() 
     displayMeals( responce.meals.slice(0,20) )
     $(".loading-screen").fadeOut(300)
}


//!============================================= Contact Us ============================================

$('.Contact-Us').on("click" , function(){
    closeSideNav()
    $('#searchContainer').html('')
    $('#rowData').html( `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
    <h2 class="fs-2 mb-4">Sign Up</h2>
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput"  type="text" class=" inputsValidation form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" type="email" class=" inputsValidation form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" type="tel" class=" inputsValidation form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" type="number" class=" inputsValidation form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" type="password" class=" inputsValidation form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter, one number and one special character: *
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" type="password" class=" inputsValidation form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-warning btn-lg mt-3">Submit</button>
    </div>
</div> `)
$('.inputsValidation').on('keyup', function(){
    $('#nameInput').on("keyup", () => {
        if(nameValidation()){
            $('#nameAlert').addClass('d-none')
            $('#nameAlert').removeClass('d-block')
        }
        else{
            $('#nameAlert').addClass('d-block')
            $('#nameAlert').removeClass('d-none')
        }
    })
    $('#emailInput').on("input", () => {
        if(emailValidation()){
            $('#emailAlert').addClass('d-none')
            $('#emailAlert').removeClass('d-block')
        }
        else{
            $('#emailAlert').addClass('d-block')
            $('#emailAlert').removeClass('d-none')
        }
    })
    $('#phoneInput').on("input", () => {
        if(phoneValidation()){
            $('#phoneAlert').addClass('d-none')
            $('#phoneAlert').removeClass('d-block')
        }
        else{
            $('#phoneAlert').addClass('d-block')
            $('#phoneAlert').removeClass('d-none')
        }
    })
    $('#ageInput').on("input", () => {
        if(ageValidation()){
            $('#ageAlert').addClass('d-none')
            $('#ageAlert').removeClass('d-block')
        }
        else{
            $('#ageAlert').addClass('d-block')
            $('#ageAlert').removeClass('d-none')
        }
    })
    $('#passwordInput').on("input", () => {
        if(passwordValidation()){
            $('#passwordAlert').addClass('d-none')
            $('#passwordAlert').removeClass('d-block')
        }
        else{
            $('#passwordAlert').addClass('d-block')
            $('#passwordAlert').removeClass('d-none')
        }
    })
    $('#repasswordInput').on("input", () => {
        if(repasswordValidation()){
            $('#repasswordAlert').addClass('d-none')
            $('#repasswordAlert').removeClass('d-block')
        }
        else{
            $('#repasswordAlert').addClass('d-block')
            $('#repasswordAlert').removeClass('d-none')
        }
    })
    if (nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation())
     {
        $('#submitBtn').removeAttr('disabled')
        } else {
            $('#submitBtn').attr('disabled' , true)
        }
})
})

//!=================================== Validation =======================================

function nameValidation() {
    let regexUrl = /^[a-zA-Z ]+$/
    let textUrl = document.getElementById("nameInput").value
    return (regexUrl.test(textUrl))
}

function emailValidation() {
    let regexUrl = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let textUrl = document.getElementById("emailInput").value
    return (regexUrl.test(textUrl))
   
}

function phoneValidation() {
    let regexUrl = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    let textUrl = document.getElementById("phoneInput").value
    return (regexUrl.test(textUrl))
    
}

function ageValidation() {
    let regexUrl = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/
    let textUrl = document.getElementById("ageInput").value
    return (regexUrl.test(textUrl))
    
}

function passwordValidation() {
    let regexUrl = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    let textUrl = document.getElementById("passwordInput").value
    return (regexUrl.test(textUrl))
   
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}