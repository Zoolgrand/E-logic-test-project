import React, { Fragment } from 'react';
import { Facebook, Instagram} from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.module.css';
import { DEFAULT_LINKS} from './sampleData';


const Footer = props => {
    const { links } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const linkGroups = Array.from(links, ([groupKey, linkProps]) => {
        const linkElements = Array.from(linkProps, ([text, pathInfo]) => {
            let path = pathInfo;
            let Component = Fragment;
            if (pathInfo && typeof pathInfo === 'object') {
                path = pathInfo.path;
                Component = pathInfo.Component;
            }

            const itemKey = `text: ${text} path:${path}`;
            const child = path ? (
                <Link data-cy="Footer-link" className={classes.link} to={path}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </Link>
            ) : (
                <span data-cy="Footer-label" className={classes.label}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </span>
            );

            return (
                <Component key={itemKey}>
                    <li className={classes.linkItem}>{child}</li>
                </Component>
            );
        });

        return (
            <ul key={groupKey} className={classes.linkGroup}>
                {linkElements}
            </ul>
        );
    });

    const contactGroup = (
        <ul className={classes.linkGroup}>
            <li className={classes.linkItemLogo}>ELOTemp</li>
            <li className={classes.linkItemAddress}>
                184 Main Rd E, St Albans VIC 3021, Australia
            </li>
            <li className={classes.linkItemMail}>contact@company.com</li>
            <li className={classes.linkItemPhone}>+001 2233 456</li>
        </ul>
    );

    return (
        <footer data-cy="Footer-root" className={classes.root}>
            <div className={classes.links}>
                {contactGroup}
                {linkGroups}
            </div>
            <div className={classes.social}>
                <div className={classes.rights}>
                    ©Elotemp 2021 All rights reserved.
                </div>
                <ul className={classes.socialLinks}>
                    <li>
                        <Instagram size={20} />
                    </li>
                    <li>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6.66669 16.6665L10 9.1665"
                                stroke="white"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8.91664 11.6668C9.28081 12.7193 10.1083 13.3335 11.0416 13.3335C12.7675 13.3335 14.1666 12.0385 14.1666 10.0002C14.1674 9.39169 14.0348 8.79044 13.7783 8.23867C13.5217 7.68691 13.1475 7.19803 12.6818 6.80639C12.2161 6.41475 11.6703 6.12986 11.0827 5.97175C10.4951 5.81363 9.88005 5.78613 9.2807 5.89117C8.68136 5.99621 8.11229 6.23124 7.6135 6.57975C7.11472 6.92826 6.69831 7.38179 6.39356 7.90845C6.08881 8.43511 5.90311 9.02213 5.84951 9.62825C5.79591 10.2344 5.87571 10.8449 6.08331 11.4168"
                                stroke="white"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                                stroke="white"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </li>
                    <li>
                        <Facebook size={20} />
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;

Footer.defaultProps = {
    links: DEFAULT_LINKS
};

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
