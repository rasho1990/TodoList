import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
const Footer = () => {
    const handleItemClick = () => (e, { name }) => this.setState({ activeItem: name })
    return (
        <div class="ui sticky">
            <Menu compact icon='labeled' floated='right' >
                <Menu.Item
                    link={'/auth'}
                    onClick={handleItemClick}
                >
                    <a target='_blank' href='https://github.com/rasho1990' rel="noopener noreferrer"> <Icon name='github' size='big' /></a>
                </Menu.Item>
                <Menu.Item
                    onClick={handleItemClick}
                >
                    <a target='_blank' href='https://www.linkedin.com/in/muhammed-rasho-620013189' rel="noopener noreferrer"> <Icon name='linkedin' size='big' /></a>
                </Menu.Item>
            </Menu>
        </div>
    )
}
export default Footer;