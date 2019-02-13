//DOM variables
const budgetBtn = document.querySelector('#budget-btn');
const budgetValue = document.querySelector('#budget');

const expenseBtn = document.querySelector('#expense-btn');
const expenseType = document.querySelector('#expense-type');
const expenseValue = document.querySelector('#expense');

const totalBudget = document.querySelector('#budget-value');
const totalExp = document.querySelector('#budget-exp');
const totalDiff = document.querySelector('#budget-diff');

const expenseList = document.querySelector('.list');

const foodValue = document.querySelector('.food-value');
const personalValue = document.querySelector('.pers-value');
const mandatoryValue = document.querySelector('.mand-value');

const foodPercent = document.querySelector('.food-percent');
const personalPercent = document.querySelector('.personal-percent');
const mandatoryPercent = document.querySelector('.mand-percent');

//Global variables to hold expenses and percentages of each spending category
const expenseArray = [];
let foodPerc = 0, personalPerc = 0, mandatoryPerc = 0;

//Handles monthly budget input
budgetBtn.addEventListener('click', e => {
  if(parseFloat(budgetValue.value) > 0){
    totalBudget.innerHTML = parseFloat(budgetValue.value).toFixed(2);
    budgetValue.value = "";
    calculateDifference();
  }

  e.preventDefault();
});

//Handles expenses
//Expenses are added to expenseArray, after which monthly expenses and percentages are calculated
//and rendered to the chart
expenseBtn.addEventListener('click', e => {
  if(parseFloat(expenseValue.value) > 0 && parseFloat(totalBudget.innerHTML) > 0){
    let currentTotal = parseFloat(totalExp.innerHTML);
    currentTotal += parseFloat(expenseValue.value);

    expenseArray.push({
      amount: parseFloat(expenseValue.value).toFixed(2),
      type: expenseType.value
    });

    console.log(expenseArray);
    addToList();
    totalExp.innerHTML = currentTotal.toFixed(2);
    expenseValue.value = "";
    calculateDifference();

    calcPercent();

    renderChart();
  }
  e.preventDefault();
});

//Adds expense to DOM 
function addToList(){
  expenseList.innerHTML += `<li>$${expenseValue.value} - ${expenseType.value}</li>`;
}

//Calculates Monthly budget and total expense difference
function calculateDifference(){
  totalDiff.innerHTML = (parseFloat(totalBudget.innerHTML) - parseFloat(totalExp.innerHTML)).toFixed(2);
}


//Calculates percentages of each expense category
function calcPercent(){
  
  let typeMap = new Map();
  typeMap.set('Food', 0.00.toFixed(2));
  typeMap.set('Personal', 0.00.toFixed(2));
  typeMap.set('Mandatory', 0.00.toFixed(2));

  expenseArray.forEach(item => {
    let mapItem = typeMap.get(item.type);

    if(mapItem !== undefined){
      let currentVal = parseFloat(mapItem);
      currentVal += parseFloat(item.amount);
      typeMap.set(item.type, currentVal.toFixed(2))
    } 
  });

  foodValue.innerHTML = `${typeMap.get('Food')}`;
  personalValue.innerHTML = `${typeMap.get('Personal')}`;
  mandatoryValue.innerHTML = `${typeMap.get('Mandatory')}`;

  foodPerc = (typeMap.get('Food') / parseFloat(totalExp.innerHTML) * 100);
  personalPerc = (typeMap.get('Personal') / parseFloat(totalExp.innerHTML) * 100);
  mandatoryPerc = (typeMap.get('Mandatory') / parseFloat(totalExp.innerHTML) * 100);
}

//Renders expense distribution chart using CanvasJS
function renderChart(){
  CanvasJS.addColorSet("chartColors",
  [//colorSet Array

  "#4169e1",
  "#ff0000",
  "#ffff00"         
  ]);

  var chart = new CanvasJS.Chart("chartContainer", {
    colorSet: 'chartColors',
    theme: "dark2",
    animationEnabled: true,
    data: [{
      type: "doughnut",
      startAngle: 60,
      // innerRadius: 60,
      
      toolTipContent: "<b>{item}:</b> (#percent%)",
      indexLabel: "",
      dataPoints: [
        { y: foodPerc, item: "Food" },
        { y: personalPerc, item: "Personal" },
        { y: mandatoryPerc, item: "Mandatory" }
      ]
    }]
  });
  chart.render();
}

