const RATES = {
    basePerKm: 50,        
    perKg: 10,         
    expressMultiplier: 1.5,
    insuranceMultiplier: 0.1, 
    liftFee: 500,          
    cargoMultipliers: {
        standard: 1.0,
        fragile: 1.3,
        perishable: 1.5,
        dangerous: 2.0
    }
};

const distanceInput = document.getElementById('distance');
const distanceValue = document.getElementById('distance-value');
const weightInput = document.getElementById('weight');
const cargoTypeSelect = document.getElementById('cargo-type');
const expressCheckbox = document.getElementById('express');
const insuranceCheckbox = document.getElementById('insurance');
const liftCheckbox = document.getElementById('lift');
const calculateBtn = document.getElementById('calculate-btn');
const totalPriceEl = document.getElementById('total-price');
const priceBreakdownEl = document.getElementById('price-breakdown');


distanceInput.addEventListener('input', function() {
    distanceValue.textContent = this.value;
});


function calculateDelivery() {
    const distance = parseFloat(distanceInput.value);
    const weight = parseFloat(weightInput.value) || 0;
    const cargoType = cargoTypeSelect.value;
    const isExpress = expressCheckbox.checked;
    const isInsurance = insuranceCheckbox.checked;
    const isLift = liftCheckbox.checked;

    let baseCost = (distance * RATES.basePerKm) + (weight * RATES.perKg);
    
    const cargoMultiplier = RATES.cargoMultipliers[cargoType];
    let costWithCargo = baseCost * cargoMultiplier;
    
    const breakdown = [
        `Базовая стоимость: ${baseCost.toFixed(0)} ₽ (${distance} км × ${RATES.basePerKm} ₽ + ${weight} кг × ${RATES.perKg} ₽)`
    ];
    
    if (cargoMultiplier > 1) {
        const extraPercent = (cargoMultiplier - 1) * 100;
        breakdown.push(`Тип груза: +${extraPercent}% (${costWithCargo.toFixed(0)} ₽)`);
    }
    
    let finalCost = costWithCargo;
    
    if (isExpress) {
        const expressCost = finalCost * (RATES.expressMultiplier - 1);
        finalCost = finalCost * RATES.expressMultiplier;
        breakdown.push(`Экспресс-доставка: +50% (+${expressCost.toFixed(0)} ₽)`);
    }
    
    if (isInsurance) {
        const insuranceCost = finalCost * RATES.insuranceMultiplier;
        finalCost = finalCost + insuranceCost;
        breakdown.push(`Страховка: +10% (+${insuranceCost.toFixed(0)} ₽)`);
    }
    
    if (isLift) {
        finalCost = finalCost + RATES.liftFee;
        breakdown.push(`Подъем на этаж: +${RATES.liftFee} ₽`);
    }
    
    totalPriceEl.textContent = `${Math.round(finalCost).toLocaleString()} ₽`;
    
    priceBreakdownEl.innerHTML = breakdown.map(item => `<div>• ${item}</div>`).join('');
    
    totalPriceEl.style.transform = 'scale(1.1)';
    setTimeout(() => {
        totalPriceEl.style.transform = 'scale(1)';
    }, 200);
}

function instantCalculate() {
    calculateDelivery();
}

distanceInput.addEventListener('input', instantCalculate);
weightInput.addEventListener('input', instantCalculate);
cargoTypeSelect.addEventListener('change', instantCalculate);
expressCheckbox.addEventListener('change', instantCalculate);
insuranceCheckbox.addEventListener('change', instantCalculate);
liftCheckbox.addEventListener('change', instantCalculate);

calculateBtn.addEventListener('click', calculateDelivery);

document.addEventListener('DOMContentLoaded', function() {
    calculateDelivery();
});

calculateBtn.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.95)';
});

calculateBtn.addEventListener('mouseup', function() {
    this.style.transform = 'scale(1)';
});

calculateBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

weightInput.addEventListener('blur', function() {
    if (this.value < 1) {
        this.value = 1;
        instantCalculate();
    }
    if (this.value > 1000) {
        this.value = 1000;
        instantCalculate();
    }
});