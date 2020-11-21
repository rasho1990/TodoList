import React, { useContext } from "react";
import { Container, Header, Message, Segment } from "semantic-ui-react";
import "pure-react-carousel/dist/react-carousel.es.css";
import { AuthContext } from './../../shared/context/auth-context';
import ImageCarousel from "../components/ImageCarousel";
const Home = () => {
    const auth = useContext(AuthContext);
    return (
        <Container style={{ margin: 20 }}>
            <Header as="h1" dividing>
                To Do List
            </Header>
            { !auth.token ? < Message info>
                How To Actually Get The Job Done With A To-Do List ?! Break it down and make your todo list for free
      </Message> : < Message info>
                    Welcome our best member feel free to make your todo list ready
      </Message>}
            <Segment attached="top">
                <Header as="h2" content="Keep it simple" />
                <p>
                    Not everyone runs on lists. However, if you’re struggling to make sense of your goals, a list could save you time, energy,
                    and the need to come up with excuses for when the thing that needs to happen.
        </p>
            </Segment>
            <Segment attached="bottom">
                <ImageCarousel />
            </Segment>
        </Container >
    );
}
export default Home;
