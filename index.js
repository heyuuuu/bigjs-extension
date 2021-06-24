import Big from "big.js"

// 计算器
function calculate(evaluate){
	const resourceArr = evaluate.match(/([\d\.]+)|(\+|\-|\*|\/)/g)
	if(resourceArr){
		// 性能优化，避免单个数值进行计算
		if(resourceArr.length === 1){
			return evaluate
		}
		resourceArr.map((val,index) => {
			const prveVal = resourceArr[index - 2]
			const operator = resourceArr[index - 1]
			if(/^[\d\.]+$/.test(prveVal)){
				if(operator == "*" || operator == "/"){
					resourceArr[index - 2] = "_"
					resourceArr[index - 1] = "_"
				}
				if(operator == "*"){
					resourceArr[index] = new Big(prveVal).times(val).toString()
				}
				if(operator == "/"){
					resourceArr[index] = new Big(prveVal).div(val).toString()
				}
			}
		})
		const resourceArr1 = resourceArr.filter(v => v !== "_")
		resourceArr1.map((val,index) => {
			const prveVal = resourceArr1[index - 2]
			const operator = resourceArr1[index - 1]
			if(/^[\d\.]+$/.test(prveVal)){
				if(operator == "+" || operator == "-"){
					resourceArr1[index - 2] = "_"
					resourceArr1[index - 1] = "_"
				}
				if(operator == "+"){
					resourceArr1[index] = new Big(prveVal).plus(val).toString()
				}
				if(operator == "-"){
					resourceArr1[index] = new Big(prveVal).minus(val).toString()
				}
			}
		})
		return resourceArr1.pop()
	}
	return ''
}

// 精度计算
function precision(evaluate,decimal = 2){
	const recursion = (evaluate) => {
		const result = evaluate.replace(/\(([^\(\)]+\))/,(_,expression)=> {
			return calculate(expression)
		})
		if(result.indexOf('(') !== -1 ){
			return recursion(result)
		}else{
			return calculate(result)
		}
	}
	const result = recursion(evaluate)
	return new Big(result).toFixed(decimal)
}

export default precision