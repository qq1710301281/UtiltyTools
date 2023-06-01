import assetLocalStorage from "../../public/localStorage/assetLocalStorage";

export default class Calculator
{
    
    constructor() {}
    
    private static handleCalculation(numArr:Array<number>, num1:number, num2:number, char:string):void
    {
        if (char == '+')
        {
            numArr.push(num1 + num2);
        }
        else if (char == '-')
        {
            numArr.push(num1 - num2);
        }
        else if (char == '*')
        {
            numArr.push(num1 * num2);
        }
        else if (char == '/')
        {
            numArr.push(num1 / num2);
        }
    }
      
    private static isPop(char1:string, char2:string):boolean
    {
        if ((char1 == '+' || char1 == '-') && (char2 == '+' || char2 == '-')) return true;
        if ((char1 == '+' || char1 == '-') && (char2 == '*' || char2 == '/')) return true;
        if ((char1 == '*' || char1 == '/') && (char2 == '*' || char2 == '/')) return true;
        if ((char1 == '*' || char1 == '/') && (char2 == '+' || char2 == '-')) return false;
    }
      
    public static calcExpression(str:string, building_level:number):number
    {
        str = str.replace(/x/,building_level+"");
        // 分割字符串
        let arr:Array<any> = [];
        for(let i=0; i<str.length; i++)
        {
            let t:string = str.charAt(i);
            if (/[\d|\.]/.test(t+''))
            {
                let v:string = "";
                let j:number = 0;
                for (j=i; j<str.length; j++)
                {
                    let m:string = str.charAt(j);
                    if (!/[\d|\.]/.test(m+''))
                    {
                        break;
                    }
                }
                v = str.slice(i, j);
                if (j > i)
                {
                    i = j - 1;
                }
                arr.push(parseFloat(v));
            }
            else
            {
                arr.push(t);
            }
        }
        
        let charArr:Array<string> = []
        let numArr:Array<number> = [];
        for (let i:number = 0; i < arr.length; i++)
        {
            if (typeof arr[i] == 'number')
            {
                numArr.push(arr[i])
            }
            else
            {
                if (charArr.length)
                {
                    // 关键步骤1
                    // 这里如果当前的字符的优先级比栈顶的优先级低或相等，
                    // 存储字符的栈要一直出栈直到栈为空或当前的字符的优先级比栈顶的优先级高，
                    while (Calculator.isPop(arr[i], charArr[charArr.length - 1]))
                    {
                        let t2:number = numArr.pop();
                        let t1:number = numArr.pop();
                        let char:string = charArr.pop();
                        Calculator.handleCalculation(numArr, t1, t2, char);
                    }
                    if (arr[i] == ')')
                    {
                        let st:string = charArr[charArr.length - 1];
                        // 关键步骤2
                        // 遇到右括号也要一直出栈，直到遇到左括号，要注意边界问题
                        while (st != '(')
                        {
                            let t1:number = 0;
                            let t2:number = 0;
                            let char:string = charArr.pop();
                            if (char != '(')
                            {
                                t2 = numArr.pop();
                                t1 = numArr.pop();
                            }
                            Calculator.handleCalculation(numArr, t1, t2, char);
                            st = char;
                        }
                    }
                    if (arr[i] != ')')
                    {
                        charArr.push(arr[i])
                    }
                }
                else
                {
                    // 关键步骤3
                    // 数字直接进栈
                    charArr.push(arr[i])
                }
            }
        }
        // 关键步骤4
        // 最后字符栈如果还有字符，要一直出栈直到为空
        while (charArr.length)
        {
            let t2:number = numArr.pop();
            let t1:number = numArr.pop();
            let char:string = charArr.pop();
            Calculator.handleCalculation(numArr, t1, t2, char);
        }
        // console.log('formula: ' + str) // 算式
        // console.log('result: ' + numArr[0]) // 程序计算结果
        // console.log('正确结果，如果和上面result相等，表明程序正确: ' + _str) // 判断程序计算结果是否正确
        return numArr[0];
    }
      
}