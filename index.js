import Big from "big.js"

const isNum = /^{?([\d\.\-]+)}?$/

function peelon(val){
    return '{' + val + '}'
}

function peeloff(val){
    const [_,rawdata] = (val||"").match(isNum) || ['0',val]
    return rawdata
}

// 计算器
function calculate(evaluate){
	const resourceArr = evaluate.match(/({\-?[\d\.]+})|([\d\.]+)|(\+|\-|\*|\/)/g)
	if(resourceArr){
		// 性能优化，避免单个数值进行计算
		if(resourceArr.length === 1){
			return evaluate
		}
		resourceArr.map((val,index) => {
			const prveVal = peeloff(resourceArr[index - 2])
			const operator = resourceArr[index - 1]
			if(isNum.test(prveVal)){
				if(operator == "*" || operator == "/"){
					resourceArr[index - 2] = "_"
					resourceArr[index - 1] = "_"
				}
				if(operator == "*"){
                    resourceArr[index] = new Big(prveVal).times(peeloff(val)).toString()
				}
				if(operator == "/"){
                    resourceArr[index] = new Big(prveVal).div(peeloff(val)).toString()
				}
			}
		})
		const resourceArr1 = resourceArr.filter(v => v !== "_")
		resourceArr1.map((val,index) => {
			const prveVal = peeloff(resourceArr1[index - 2])
			const operator = resourceArr1[index - 1]
			if(isNum.test(prveVal)){
				if(operator == "+" || operator == "-"){
					resourceArr1[index - 2] = "_"
					resourceArr1[index - 1] = "_"
				}
				if(operator == "+"){
                    resourceArr1[index] = new Big(prveVal).plus(peeloff(val)).toString()
				}
				if(operator == "-"){
                    resourceArr1[index] = new Big(prveVal).minus(peeloff(val)).toString()
				}
			}
		})
		return peelon(resourceArr1.pop())
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