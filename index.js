import Big from "big.js"

// 占位符
const placeholder = "_"
// 是否是数字
const isNum = /^{?(\-?[\d\.]+)}?$/

function peelon(val){
    return '{' + val + '}'
}

function peeloff(val){
    const [_,rawdata] = (val||"").match(isNum) || ['0',val]
    return rawdata
}

// 计算器
function calculate(evaluate){
	const analyzeArr = evaluate.match(/({\-?[\d\.]+})|([\d\.]+)|(\+|\-|\*|\/)/g)
	// 对负数进行修复
	analyzeArr.map((val,index,arr) => {
		const prveVal = arr[index - 2]
		const operator = arr[index - 1]
		if(!isNum.test(prveVal) && operator == "-" && isNum.test(val)) {
			const crrentVal = ("-" + peeloff(val)).replace("--", '')
			arr[index - 1] = placeholder
			arr[index] = peelon(crrentVal)
		}
	})
	const primaryArr = analyzeArr.filter(v => v !== placeholder)
	if(primaryArr){
		// 性能优化，避免单个数值进行计算
		if(primaryArr.length === 1){
			return primaryArr[0]
		}
		// 优先计算
		primaryArr.map((val,index,arr) => {
			const prveVal = peeloff(arr[index - 2])
			const operator = arr[index - 1]
			const currentval = peeloff(val)
			if(isNum.test(prveVal)){
				if(operator == "*" || operator == "/"){
					arr[index - 2] = placeholder
					arr[index - 1] = placeholder
					if(prveVal == 0 || currentval == 0) {
						return resourceArr[index] = '0'
					}
				}
				if(operator == "*"){
                    arr[index] = new Big(prveVal).times(currentval).toString()
				}
				if(operator == "/"){
                    arr[index] = new Big(prveVal).div(currentval).toString()
				}
			}
			return arr[index]
		})
		// 次要计算
		const secondaryArr = primaryArr.filter(v => v !== placeholder)
		secondaryArr.map((val,index,arr) => {
			const prveVal = peeloff(arr[index - 2])
			const operator = arr[index - 1]
			if(isNum.test(prveVal)){
				if(operator == "+" || operator == "-"){
					arr[index - 2] = placeholder
					arr[index - 1] = placeholder
				}
				if(operator == "+"){
                    arr[index] = new Big(prveVal).plus(peeloff(val)).toString()
				}
				if(operator == "-"){
                    arr[index] = new Big(prveVal).minus(peeloff(val)).toString()
				}
			}
			return arr[index]
		})
		return peelon(secondaryArr.pop())
	}
	return '0'
}

// 精度计算
function precision(evaluate,decimal = 2){
	const recursion = (evaluate) => {
		const result = evaluate.replace(/\(([^\(\)]+\))/,(expression)=> {
			return calculate(expression)
		})
		if(result.indexOf('(') !== -1 ){
			return recursion(result)
		}else{
			return calculate(result)
		}
	}
	const result = peeloff(recursion(evaluate))
	return new Big(result).toFixed(decimal)
}

export default precision