export const otpMessage = (otp, number) => {
  return `Greetings+from+Swayam+Enterprises+Dear+User+%2C+Your+OTP+for+%5Baction%2C+e.g.%2C+verifying+your+order%2C+completing+your+purchase%2C+etc.%5D+is+${otp}.+This+OTP+is+valid+for+the+next+10+minutes.+Thank+you+for+choosing+Swayam+Enterprises%21+Need+help%3F+Contact+us+at+swayamenterprisessm%40gmail.com%2F9826329200.&mobile=${number}`
};

export const preOrderCompleteSms = (number, orderId, amount) => {
  return `Thank+you+for+placing+Order%21+We%3F%3F%3Fre+currently+processing+your+order+and+will+send+you+an+update.+You+can+expect+to+receive+a+shipping+confirmation+email+with+tracking+details+shortly.+For+further+assistance%2C+Kindly+contact+to+our+customer+service+team+at+swayamenterprisessm%40gmail.com+or+9826329200.+Thank+you+again+for+your+purchase.+We+hope+you+have+a+Great+Experience%21+Best+regards%2C+Swayam+Enterprises%2C9826329200&mobile=${number}`
};