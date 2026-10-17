// Public hosted signup URL only. No Kit credentials belong in either website.
const configured = import.meta.env.PUBLIC_NEWSLETTER_SIGNUP_URL?.trim() ?? 'https://mc-product-labs.kit.com/795deb861b';
let signupUrl = '';
if (configured) {
  const parsed = new URL(configured);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password ||
      !['kit.com', 'ck.page', 'convertkit.com'].some(host => parsed.hostname === host || parsed.hostname.endsWith('.' + host))) {
    throw new Error('Use the verified public Kit newsletter signup URL');
  }
  signupUrl = parsed.href;
}
export const newsletter = { signupUrl, formId: '10056639', uid: '795deb861b',
  options: JSON.stringify({settings:{after_subscribe:{action:'message',success_message:'Thanks! Check your email to confirm your subscription.',redirect_url:''},
    analytics:{google:null,fathom:null,facebook:null,segment:null,pinterest:null,sparkloop:null,googletagmanager:null},
    powered_by:{show:true,url:'https://kit.com/features/forms'},recaptcha:{enabled:false},
    return_visitor:{action:'custom_content',custom_content:"You're on the list. Thanks for reading."}},version:'5'}) };
