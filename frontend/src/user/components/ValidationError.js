import React from 'react';

const ValidationError = (props) => {

    return <div class="ui error message" >
        <p>{props.err}</p>
    </div>
}

export default ValidationError;