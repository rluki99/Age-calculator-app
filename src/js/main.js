const dayInput = document.querySelector('#day')
const monthInput = document.querySelector('#month')
const yearInput = document.querySelector('#year')
const subBtn = document.querySelector('.submit')
const inputs = document.querySelectorAll('input')

const daysSpan = document.querySelector('#days')
const monthsSpan = document.querySelector('#months')
const yearsSpan = document.querySelector('#years')

//our months can have 30/31/29/28 days
const dateDiff = (date1, date2) => {
    const years = date2.getFullYear() - date1.getFullYear();
    const months = date2.getMonth() - date1.getMonth();
    const days = date2.getDate() - date1.getDate();

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    let adjustedMonths = years * 12 + months;
    let adjustedDays = days;

    if (days < 0) {
        adjustedMonths--;
        const prevMonth = (date2.getMonth() - 1 + 12) % 12;
        const prevMonthYear = date2.getFullYear() - (prevMonth === 11 ? 1 : 0);
        adjustedDays += daysInMonth(prevMonthYear, prevMonth);
    }

    if (adjustedDays === daysInMonth(date2.getFullYear(), date2.getMonth() - 1)) {
        adjustedDays = 0;
        adjustedMonths++;
    }

    const adjustedYears = Math.floor(adjustedMonths / 12);
    adjustedMonths %= 12;

    return { years: adjustedYears, months: adjustedMonths, days: adjustedDays };
};


const getCurrentAndInputDate = (dayInput, monthInput, yearInput) => {
	const currentDate = new Date();
	const inputDate = new Date(
		parseInt(yearInput.value, 10),
		//months are indexed from 0 to 11
		parseInt(monthInput.value, 10) - 1,
		parseInt(dayInput.value, 10)
	  );
	  return { currentDate, inputDate };
}

const countDate = () => {
	const isDayValid = validateInput(dayInput, dayInput, monthInput, yearInput)
	const isMonthValid = validateInput(monthInput, dayInput, monthInput, yearInput)
	const isYearValid = validateInput(yearInput, dayInput, monthInput, yearInput)

	if (!isDayValid || !isMonthValid || !isYearValid) {
		return
	}

	const { currentDate, inputDate } = getCurrentAndInputDate(dayInput, monthInput, yearInput);
	const diff = dateDiff(inputDate, currentDate)

	daysSpan.textContent = diff.days
	monthsSpan.textContent = diff.months
	yearsSpan.textContent = diff.years
}

const validateInput = (input, dayInput, monthInput, yearInput) => {
	const errorElement = input.nextElementSibling
	const labelElement = input.previousElementSibling
	const minValue = parseInt(input.getAttribute('min'), 10)
	const maxValue = parseInt(input.getAttribute('max'), 10)
	const { currentDate, inputDate } = getCurrentAndInputDate(dayInput, monthInput, yearInput);

	clearErrors(labelElement, input, errorElement)

	if (input.value === '') {
		addErrors(labelElement, input)
		errorElement.textContent = `This field is required`
		return false
	} else if (
		input.id === 'year' &&
		(parseInt(input.value, 10) > currentDate.getFullYear() ||
			(parseInt(input.value, 10) === currentDate.getFullYear() &&
				(parseInt(monthInput.value, 10) > currentDate.getMonth() + 1 ||
					(parseInt(monthInput.value, 10) === currentDate.getMonth() + 1 &&
						parseInt(dayInput.value, 10) > currentDate.getDate()))))
	) {
		addErrors(labelElement, input)
		errorElement.textContent = `Must be in the past`
		return false
	} else if (
		(minValue !== null && parseInt(input.value, 10) < minValue) ||
		(maxValue !== null && parseInt(input.value, 10) > maxValue)
	) {
		addErrors(labelElement, input)
		errorElement.textContent = `Must be a valid ${input.id}`
		return false
	} else if (
		inputDate.getFullYear() !== parseInt(yearInput.value, 10) ||
		inputDate.getMonth() !== parseInt(monthInput.value, 10) - 1 ||
		inputDate.getDate() !== parseInt(dayInput.value, 10)
	) {
		addErrorToAllInputs([dayInput, monthInput, yearInput], `Must be a valid date`)
		return false
	} else {
		clearErrors(labelElement, input, errorElement)
		return true
	}
}


const clearErrors = (label, input, errorMsg) => {
	label.classList.remove('error')
	input.classList.remove('error')
	errorMsg.textContent = ''
}

const addErrors = (label, input) => {
	label.classList.add('error')
	input.classList.add('error')
}

const addErrorToAllInputs = (inputs, errorMsg) => {
	inputs.forEach((input) => {
		const labelElement = input.previousElementSibling
		const errorElement = input.nextElementSibling
		labelElement.classList.add('error')
		input.classList.add('error')
		if (input.id === 'day') {
			errorElement.textContent = errorMsg
		}
	})
}

const enterCheck = (e) => {
	if (e.key === 'Enter') {
		countDate()
	}
}

subBtn.addEventListener('click', countDate)
inputs.forEach((input) => input.addEventListener('keyup', enterCheck))
