const informationLinks = new Map()
    .set('Information', null)
    .set('Track Order', null)
    .set('Premier Delivery', null)
    .set('Student Discount', null);

const shopLinks = new Map()
    .set('Shop', null)
    .set('About Us', '/about-us')
    .set('Careers', null)
    .set('Coporate', null)
    .set('Investors', null);

const companyLinks = new Map()
    .set('Company', null)
    .set('Shoes', null)
    .set('Bags', null)
    .set('Wallets', null)
    .set('Belts', null);

export const DEFAULT_LINKS = new Map()
    .set('information', informationLinks)
    .set('shop', shopLinks)
    .set('company', companyLinks);
