import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
const Footer = () => {
    const handleItemClick = () => (e, { name }) => this.setState({ activeItem: name })
    return (
     
        <Menu compact icon="labeled" floated="right">
          <Menu.Item
            link
            target="_blank"
            href="https://github.com/rasho1990"
            rel="noopener noreferrer"
            onClick={handleItemClick}
          >
            <Icon name="github" size="large" color="blue"/>
          </Menu.Item>
          <Menu.Item
            link
            target="_blank"
            href="https://www.linkedin.com/in/muhammed-rasho-620013189"
            rel="noopener noreferrer"
            onClick={handleItemClick}
          >
            <Icon name="linkedin" size="large" color="blue"/>
          </Menu.Item>
        </Menu>
      
    );
}
export default Footer;