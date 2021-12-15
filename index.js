
const objects = ['апельсин', 'груша', 'яблуко', 'банан', 'мандарин', 'олівці']
const actions = ['з\'їв', 'поклав', 'забрав']
let task = []
let firstPart = [];
let secondPart = [];
let initialObjects = [] // що лежало на столі
let actionedObjects = [] // що хлопчик зїв або поклав, скільки мандаринів, апельсинів тощо
let arrQuestions = [];
let isContinue = true;
let validation;
let validation2;
let answers = document.getElementById('answers');
let infoObj = document.getElementById('objects');
let infoAct = document.getElementById('actions');

infoObj.innerHTML = objects;
infoAct.innerHTML = actions;

let button = document.getElementById('button');
let textElement = document.getElementById('task');

button.onclick = () => {
    let value = textElement.value;
    answers.innerHTML = ''
    if (task === []) {
        task += value;
    }
    else {
        task = []
        task += value;
    }
    firstPart = [];
    secondPart = [];
    initialObjects = []
    actionedObjects = []
    arrQuestions = [];
    let prevalidation = PreValidation(task, actions, objects)
    if (prevalidation) {
        task = task.split('.');
        firstPart = task[0].trim().split(' ');
        let objByText = KeywordSearch(firstPart, objects) // перше речення
        let objByNumeric = ObjectsOnTableByNumeric(firstPart)
        if (objByText.length !== objByNumeric.length) {
            validation = CompareArraysObjects(objByText, objByNumeric)
        } else {
            let arr = [...objByText]
            for (let x = 0; x < objByText.length; x++) {
                for (let y = 0; y < objByNumeric.length; y++) {
                    if (objByText[x] === objByNumeric[y].obj) {
                        let index = arr.findIndex(p => objByNumeric[y].obj === p)
                        arr.splice(index, 1)
                        initialObjects.push(objByNumeric[y])
                        validation = true;
                    }
                }
            }
            if (arr.length !== 0) {
                validation = CompareArraysObjects(objByText, objByNumeric)
            }
        }
        if (validation) {
            secondPart = task[1].trim().split(' ');
            let objByTextSecond = KeywordSearch(secondPart, objects) // друге речення
            let objByNumericSecond = ObjectsOnTableByNumeric(secondPart)
            if (objByTextSecond.length !== objByNumericSecond.length) {
                validation2 = CompareArraysObjects(objByTextSecond, objByNumericSecond)
            } else {
                let arr = [...objByTextSecond]
                for (let x = 0; x < objByTextSecond.length; x++) {
                    for (let y = 0; y < objByNumericSecond.length; y++) {
                        if (objByTextSecond[x] === objByNumericSecond[y].obj) {
                            let index = arr.findIndex(p => objByNumericSecond[y].obj === p)
                            arr.splice(index, 1)
                            actionedObjects.push(objByNumericSecond[y])
                            validation2 = true;
                        }
                    }
                }
                if (arr.length !== 0) {
                    validation2 = CompareArraysObjects(objByTextSecond, objByNumericSecond)
                }
            }
            if (validation2) {
                let action = KeywordSearch(secondPart, actions)[0]
                let finalCount = Calculation(initialObjects, actionedObjects, action)
                if (finalCount) {
                    isContinue=true;
                    arrQuestions = task[2].trim()
                    let questions = arrQuestions.split('?');
                    for (let j = 0; j < questions.length; j++) {
                        if (isContinue) {
                            let questionWithTrim = questions[j].trim()
                            let arrayWords = questionWithTrim.split(' ')
                            let answer = Answer(arrayWords, action, finalCount, actionedObjects, actions)
                            if (answer) {
                                answers.innerHTML += answer;
                            } else {
                                isContinue = false
                            }
                        }
                    }
                }
            }
        }
    }
}

let PreValidation = (value, actionArray, objectsArray) => {
    let partsWithTrim = []
    let questionsWithTrim = []
    let parts = []
    parts = value.split('.')
    if (parts.length === 3 && parts[2] !== '') {
        for (let i = 0; i < parts.length; i++) {
            partsWithTrim.push(parts[i].trim())
        }
        let descriptionObj = partsWithTrim[0].split(' ')
        let symbols = partsWithTrim[0].split('')
        let symbol = symbols.indexOf(',')
        if (symbols[symbol + 1] === ' ' || symbol===-1) {
            let action = partsWithTrim[1].split(' ')
            let arrayQuestions = partsWithTrim[2].split('?')
            let check1 = isQuestion(descriptionObj)
            let check2 = KeywordSearch(descriptionObj, actionArray)
            let check3 = KeywordSearch(descriptionObj, objectsArray)
            if (check1 || check2 || !check3) {
                alert('Перше речення повинно бути описом предметів. ')
                return false
            }
            check1 = isQuestion(action)
            check2 = KeywordSearch(action, actionArray)
            check3 = KeywordSearch(action, objectsArray)
            if (check1 || !check2 || !check3) {
                alert('Друге речення має містити дію, яку зробив хлопчик або у реченні відсутній предмет. ')
                return false
            }
            let check4 = CountQuestions(partsWithTrim[2])
            if (check4) {
                for (let j = 0; j < arrayQuestions.length; j++) {
                    questionsWithTrim.push(arrayQuestions[j].trim());
                    if (questionsWithTrim[j] !== '') {
                        let words = questionsWithTrim[j].split(' ')
                        check1 = isQuestion(words)
                        if (!check1) {
                            let index = j + 3
                            alert(index + ' речення повинно починатись зі слова "Скільки" . ')
                            return false
                        }
                    }
                }
            }
            return value
        }
        else {
            alert('У вас відсутній пробіл після , ')
            return false
        }

    }
    else {
        alert('Не корректно введене завдання. Перше речення - опис предметів, друге - що зробив хлопчик. Третє - питання.')
        return false;
    }

}

let isQuestion = (array) => {
    if (array[0] === 'Скільки') {
        return true
    } else {
        return false
    }
}
let CountQuestions = (question) => {
    let words = question.split(' ')
    let symbols = question.split('')
    let countWord = 0;
    let countQMarks = 0;
    for (let i = 0; i < words.length; i++) {
        if (words[i] === 'Скільки') {
            countWord++;
        }
    }
    for (let j = 0; j < symbols.length; j++) {
        if (symbols[j] === '?') {
            countQMarks++;
        }
    }
    if (countWord === countQMarks) {
        return true
    } else {
        alert('Ви пропустили ? або слово "Скільки" в блоці питань')
        return false
    }
}

const KeywordSearch = (array, initialArr) => { //шукає слова 
    let arr = []
    let countLetter = 0;
    for (let i = 0; i < initialArr.length; i++) {
        let object = initialArr[i].split('')
        for (let j = 0; j < array.length; j++) {
            let word = array[j].split('')
            if (countLetter) {
                countLetter = 0
            }
            for (let x = 0; x < object.length; x++) {
                if (object[x] === word[x]) {
                    countLetter += 1
                }
            }
            if (object.length - 2 <= countLetter) {
                let obj = initialArr[i]
                arr.push(obj)
            }
        }
    }
    if (arr.length) {
        return arr
    } else {
        return false
    }

}

let ObjectsOnTableByNumeric = (array) => { // шукає за числом предмет
    let arr = []
    for (let i = 0; i < array.length; i++) {
        let count = Number(array[i])
        if (!Number.isNaN(count)) {
            if (count > 0) {
                let word = array[i + 1].split('')
                let countLetter = 0
                for (let j = 0; j < objects.length; j++) {
                    if (!countLetter) {
                        let object = objects[j].split('')
                        for (let k = 0; k < object.length; k++) {
                            if (word[k] === object[k]) {
                                countLetter++;
                            }
                        }
                        if (word.length - 4 >= countLetter) {
                            countLetter = 0
                        }
                        if (object.length - 2 <= countLetter) {
                            let obj = objects[j]
                            arr.push({ count, obj })
                        } else {
                            if (j + 1 === objects.length) {
                                let obj = array[i + 1]
                                arr.push({ count, obj })
                            }
                        }
                    }
                }

            } else {
                alert('У вас від\'ємна кількість ' + array[i + 1])
                return false
            }

        }
    }

    return arr
}

let CompareArraysObjects = (arr, arr2) => { //порівняння об'єктів в масивах
    if (arr2.length > arr.length) {
        let arr3 = [...arr2];
        for (let x = 0; x < arr.length; x++) {
            for (let y = 0; y < arr2.length; y++) {
                if (arr[x] === arr2[y].obj) {
                    let index = arr3.findIndex(p => arr2[y].obj === p.obj)
                    arr3.splice(index, 1)
                }
            }
        }
        for (let x = 0; x < arr3.length; x++) {
            if (typeof (arr3[x].count)) {
                alert('Ваша програма не розрахована на ' + arr3[x].obj)
                return false
            }
        }

    } else {
        if (arr2.length < arr.length) {
            let arr3 = [...arr];
            for (let x = 0; x < arr2.length; x++) {
                for (let y = 0; y < arr.length; y++) {
                    if (arr2[x].obj === arr[y]) {
                        let index = arr3.findIndex(p => arr[y] === p)
                        arr3.splice(index, 1)
                    }
                }
            }
            for (let x = 0; x < arr3.length; x++) {
                if (arr3[x].length !== 0) {
                    alert('Напишіть кількість ' + arr3[x] + ' спереді')
                    return false
                }
            }

        } else {
            if (arr2.length === arr.length) {
                let arr3 = [...arr];
                for (let x = 0; x < arr2.length; x++) {
                    for (let y = 0; y < arr.length; y++) {
                        if (arr2[x].obj === arr[y]) {
                            let index = arr3.findIndex(p => arr[y] === p)
                            arr3.splice(index, 1)
                        }
                    }
                }
                if (arr3.length !== 0) {
                    alert('Напишіть кількість ' + arr3 + ' спереді')
                    return false
                }
                let arr4 = [...arr2];
                for (let x = 0; x < arr.length; x++) {
                    for (let y = 0; y < arr2.length; y++) {
                        if (arr[x] === arr2[y].obj) {
                            let index = arr4.findIndex(p => arr2[y].obj === p.obj)
                            arr4.splice(index, 1)
                        }
                    }
                }
                if (arr4.length !== 0) {
                    alert('Ваша програма не розрахована на ' + arr4)
                    return false
                }

            }
        }
    }

}

let isOnTable = (arr, arr2) => { //перевірка чи був предмет на столі
    for (let j = 0; j < arr2.length; j++) {
        let result = arr.some((x) => { return x.obj === arr2[j].obj })
        if (!result) {
            alert('У хлопчика не було на столі ' + arr2[j].obj)
            return false
        }
    }
    return true
}

let Calculation = (initialObj, actObj, action) => { //підрахунок предметів пясля дії хлопчика
    let arr = [...initialObj]
    let onTable = false;
    let isAdded = false;
    switch (action) {
        case "з\'їв":
            onTable = isOnTable(initialObj, actObj)
            if (onTable) {
                for (let x = 0; x < actObj.length; x++) {
                    for (let y = 0; y < initialObj.length; y++) {
                        if (actObj[x].obj === initialObj[y].obj) {
                            let obj = initialObj[y].obj;
                            let count = initialObj[y].count - actObj[x].count;
                            if (count >= 0) {
                                arr[y] = { count, obj }
                            } else {
                                alert('Хлопчик з\'їв більше ' + actObj[x].obj + ', ніж було на столі')
                                return false
                            }

                        }
                    }
                } return arr;
            } else {
                return false
            }

        case "забрав":
            onTable = isOnTable(initialObj, actObj)
            if (onTable) {
                for (let x = 0; x < actObj.length; x++) {
                    for (let y = 0; y < initialObj.length; y++) {
                        if (actObj[x].obj === initialObj[y].obj) {
                            let obj = initialObj[y].obj;
                            let count = initialObj[y].count - actObj[x].count;
                            if (count >= 0) {
                                arr[y] = { count, obj }
                            }
                            else {
                                alert('Хлопчик забрав більше ' + actObj[x].obj + ', ніж було на столі')
                                return false
                            }

                        }
                    }
                } return arr;
            } else {
                return false
            }

        case "поклав":
            for (let x = 0; x < actObj.length; x++) {
                isAdded = false
                for (let y = 0; y < initialObj.length; y++) {
                    if (!isAdded) {
                        if (actObj[x].obj === initialObj[y].obj) {
                            let obj = initialObj[y].obj;
                            let count = initialObj[y].count + actObj[x].count;
                            arr[y] = { count, obj }
                            isAdded = true;
                        } else {
                            if (y + 1 === initialObj.length) {
                                let obj = actObj[x].obj;
                                let count = actObj[x].count;
                                arr.push({ count, obj })
                                isAdded = true;
                            }
                        }
                    }
                }
            } return arr;
        default:
            alert('Програма не розрахована на ' + action)
            return false
    }
}

let Answer = (arr, action, finalArray, actionObjArr, arrActProgram) => { //формування відмовіді
    let element;
    let countAnswer = 0;
    let result = '';
    if (arr[0] !== '') {
        let objReuest = KeywordSearch(arr, objects)
        let actionRequest = KeywordSearch(arr, actions)
        if (!objReuest.length) {
            element = ''
            element = arr.filter((x) => { return (x === 'фруктів') })[0]
            if (typeof (element) !== 'undefined') {
                objReuest = [element]
            } else {
                alert('Немає об\'єкта в питальному реченні.')
                return false
            }
        }
        if (!actionRequest.length) {
            element = ''
            element = arr.filter((x) => { return (x === 'залишилось') })[0]
            if (typeof (element) !== 'undefined') {
                actionRequest = [element]
            } else {
                alert('Немає дії в ' + arr)
                return false
            }
        }

        switch (actionRequest[0]) {
            case "залишилось":
                switch (objReuest[0]) {
                    case 'фруктів':
                        for (let i = 0; i < finalArray.length; i++) {
                            countAnswer += finalArray[i].count
                        }
                        result += 'На столі залишилось ' + countAnswer + ' фруктів. '
                        return result
                    case 'яблуко':
                        result = getRemainingObjectsAnswer(finalArray, 'яблуко')
                        if (result === '') {
                            alert('У хлопчика не було яблук на столі')
                            return false
                        }
                        return result
                    case 'апельсин':
                        result = getRemainingObjectsAnswer(finalArray, 'апельсин')
                        if (result === '') {
                            alert('У хлопчика не було апельсинів на столі')
                            return false
                        }
                        return result
                    case 'груша':
                        result = getRemainingObjectsAnswer(finalArray, 'груша')
                        if (result === '') {
                            alert('У хлопчика не було груш на столі')
                            return false
                        }
                        return result
                    case 'банан':
                        result = getRemainingObjectsAnswer(finalArray, 'банан')
                        if (result === '') {
                            alert('У хлопчика не було бананів на столі')
                            return false
                        }
                        return result
                    case 'олівці':
                        result = getRemainingObjectsAnswer(finalArray, 'олівці')
                        if (result === '') {
                            alert('У хлопчика не було олівців на столі')
                            return false
                        }
                        return result
                    case 'мандарин':
                        result = getRemainingObjectsAnswer(finalArray, 'мандарин')
                        if (result === '') {
                            alert('У хлопчика не було мандарин на столі')
                            return false
                        }
                        return result
                    default:
                        alert('Програма не може показати відповідь для об\'єка ' + questionObj[0])
                        return false

                }

            case arrActProgram[0]:
                result = getAnotherAnswer(objReuest[0], action, arrActProgram[0], actionObjArr, actionRequest[0])
                return result
            case arrActProgram[1]:
                result = getAnotherAnswer(objReuest[0], action, arrActProgram[1], actionObjArr, actionRequest[0])
                return result
            case arrActProgram[2]:
                result = getAnotherAnswer(objReuest[0], action, arrActProgram[2], actionObjArr, actionRequest[0])
                return result
            default:
                alert('Невірно вказана дія.')
                return false
        }
    }

}

let getRemainingObjectsAnswer = (finalArray, obj) => { //відповідь, якщо в питанні є слово "залишилось" та об'єкт
    let result = ''
    for (let i = 0; i < finalArray.length; i++) {
        if (finalArray[i].obj === obj) {
            let countAnswer = finalArray[i].count
            result += 'На столі залишилось ' + countAnswer + ' ' + obj + '. '
        }
    }
    return result
}

let getAnotherAnswer = (requestedObj, action, actionsProgram, actionObjArr, actionRequest) => {//відповідь, якщо в питанні є слово з масиву дій та воно збігається з дією хлопчика
    let countAnswer = 0;
    let result = ''
    if (requestedObj === 'фруктів') {
        if (actionsProgram === action) {
            for (let i = 0; i < actionObjArr.length; i++) {
                countAnswer += actionObjArr[i].count
            }
            result += 'Хлопчик ' + actionRequest + ' ' + countAnswer + ' фруктів. '
            return result
        } else {
            alert('Хлопчик ' + action + ' фрукти, а не ' + actionsProgram)
            return false
        }
    }
}


