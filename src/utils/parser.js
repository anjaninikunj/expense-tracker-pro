export const parseVoiceCommand = (text) => {
  const normalized = text.toLowerCase().trim();
  
  // Initialize result
  const result = {
    amount: 0,
    type: 'expense', // default
    category: 'Home',
    subCategory: 'General',
    description: text,
    source: 'Cash',
    destination: null,
    date: new Date().toISOString(),
    id: Date.now(),
    excludeFromBalance: false,
  };

  // 1. Extract Amount (e.g., Rs. 5000, 3500, 99)
  const amountMatch = normalized.match(/(?:rs\.?|rupees|inr|માં|મા)?\s*(\d+(?:,\d+)*)/i);
  if (amountMatch) {
    result.amount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
  } else {
    // Fallback for any number in the text (at least 1 digit)
    const fallbackMatch = normalized.match(/(\d+)/);
    if (fallbackMatch) result.amount = parseInt(fallbackMatch[1], 10);
  }

  // 1b. Extra keyword detection for Recharge
  if (normalized.includes('recharge')) {
    result.subCategory = 'Utility';
  }

  // 2. Identify Category
  if (normalized.includes('wife') || normalized.includes('anju') || normalized.includes('blouse') || normalized.includes('પત્ની') || normalized.includes('અંજુ')) {
    result.category = 'Wife';
    if (normalized.includes('blouse')) result.subCategory = 'Clothes';
    if (normalized.includes('excercise') || normalized.includes('exercise')) result.subCategory = 'Health';
  } else if (normalized.includes('children') || normalized.includes('son') || normalized.includes('priyansh') || 
             normalized.includes('tution') || normalized.includes('school') || normalized.includes('દીકરો') || normalized.includes('પ્રિયાંશ')) {
    result.category = 'Son';
    if (normalized.includes('tution') || normalized.includes('school')) result.subCategory = 'Education';
  } else if (normalized.includes('father') || normalized.includes('crops') || normalized.includes('harvesting') || 
             normalized.includes('labour') || normalized.includes('પિતા') || normalized.includes('ખેતી')) {
    result.category = 'Father';
    if (normalized.includes('labour')) result.subCategory = 'Labour';
    if (normalized.includes('crops')) result.subCategory = 'Farm Activity';
  } else if (normalized.includes('farm') || normalized.includes('ખેતર')) {
    result.category = 'Farm';
  } else if (normalized.includes('home') || normalized.includes('rent')) {
    result.category = 'Home';
    if (normalized.includes('rent')) result.subCategory = 'Rent';
  } else if (normalized.includes('investment') || normalized.includes('asset') || normalized.includes('fund') || 
             normalized.includes('ઇન્વેસ્ટ') || normalized.includes('રોકાણ') || normalized.includes('ફંડ') || 
             normalized.includes('કોટક') || normalized.includes('ગોલ્ડ') || normalized.includes('સિલ્વર')) {
    result.category = 'Investment';
    result.type = 'expense'; // Investments are usually outflows
    if (normalized.includes('asset') || normalized.includes('fund') || normalized.includes('ફંડ')) {
      result.subCategory = 'Mutual Fund';
    } else if (normalized.includes('gold') || normalized.includes('silver') || normalized.includes('ગોલ્ડ') || normalized.includes('સિલ્વર')) {
      result.subCategory = 'Commodities';
    }
  } else if (normalized.includes('mom') || normalized.includes('mother') || normalized.includes('physiotherapy')) {
    result.category = 'Mom';
    if (normalized.includes('physiotherapy')) result.subCategory = 'Medical';
  }

  // 4. Detect "Not Debit" flag
  if (normalized.includes('not debit') || normalized.includes('from focus') || normalized.includes('outside') || normalized.includes('given directly')) {
    result.excludeFromBalance = true;
  }

  // 3. Identify Type & Banks
  if (normalized.includes('withdraw') || normalized.includes('widthraw')) {
    result.type = 'withdrawal';
    result.source = normalized.includes('xbob') || normalized.includes('bob') ? 'BOB Bank' : 'Bank';
  } else if (normalized.includes('transfer') || normalized.includes('translate') || normalized.includes('to')) {
    result.type = 'transfer';
    if (normalized.includes('xbob') && normalized.includes('icici')) {
      result.source = 'BOB Bank';
      result.destination = 'ICICI Bank';
    }
  } else if (normalized.includes('cr') || normalized.includes('income') || normalized.includes('deposit') || 
      normalized.includes('received') || normalized.includes('got') || 
      normalized.includes('મળી') || normalized.includes('મળ્યા') || normalized.includes('જમા') || normalized.includes('આવ્યા')) {
    result.type = 'income';
  } else if (normalized.includes('dr') || normalized.includes('debit') || normalized.includes('gone') || 
             normalized.includes('installment') || normalized.includes('spent') || normalized.includes('gave') || normalized.includes('given')) {
    result.type = 'expense';
    if (normalized.includes('icici')) result.source = 'ICICI Bank';
  }

  return result;
};
