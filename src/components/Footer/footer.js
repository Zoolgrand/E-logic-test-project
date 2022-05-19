import React, { Fragment } from 'react';
import { Facebook, Instagram } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.module.css';
import { DEFAULT_LINKS } from './sampleData';
import logo from '../../assets/Frame.svg';

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
                        <img src={logo} alt="pinterest" />
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
