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

  // 1. Extract Amount (Ultimate detection for "rupees of", "amount is", etc.)
  const amountMatch = normalized.match(/(?:rs\.?|rupees|inr|amount|is|of|રૂપિયા|માં|મા|\s)+(\d+(?:,\d+)*)/i);
  if (amountMatch) {
    result.amount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
  } else {
    // Fallback: find the largest number if regex missed it
    const allNumbers = normalized.match(/\d+/g);
    if (allNumbers) {
      result.amount = Math.max(...allNumbers.map(n => parseInt(n, 10)));
    }
  }

  // 2. Identify Category
  if (normalized.includes('wife') || normalized.includes('anju')) {
    result.category = 'Wife';
  } else if (normalized.includes('son') || normalized.includes('child') || normalized.includes('kid') || normalized.includes('toys') || normalized.includes('દીકરો')) {
    result.category = 'Son';
    if (normalized.includes('toys')) result.subCategory = 'Toys';
  } else if (normalized.includes('father') || normalized.includes('papa') || normalized.includes('medicine') || normalized.includes('ખેતી')) {
    result.category = 'Father';
    if (normalized.includes('medicine')) result.subCategory = 'Health';
  } else if (normalized.includes('mom') || normalized.includes('મમ્મી')) {
    result.category = 'Mom';
  } else if (normalized.includes('rent') || normalized.includes('ren') || normalized.includes('ભાડુ')) {
    result.category = 'Rent';
  } else if (normalized.includes('farm') || normalized.includes('ખેતર')) {
    result.category = 'Farm';
  } else if (normalized.includes('home') || normalized.includes('ઘર') || normalized.includes('grocery') || normalized.includes('vegetable')) {
    result.category = 'Home';
  }

  // 3. Identify Type
  const hasWord = (word) => new RegExp(`\\b${word}\\b`, 'i').test(normalized);
  
  if (hasWord('withdraw') || hasWord('withdrawal')) {
    result.type = 'withdrawal';
  } else if (hasWord('transfer')) {
    result.type = 'transfer';
  } else if (hasWord('income') || hasWord('received') || hasWord('got') || hasWord('cr') || hasWord('credit') || 
             normalized.includes('આપ્યા') || normalized.includes('મને')) {
    result.type = 'income';
  } else if (hasWord('expense') || hasWord('spent') || hasWord('bought') || hasWord('buy') || 
             hasWord('paid') || hasWord('dr') || hasWord('debit') ||
             normalized.includes('ખર્ચ') || normalized.includes('ચૂકવ્યા')) {
    result.type = 'expense';
  }

  console.log("Parsed Voice Command:", { text, normalized, result });
  return result;
};
