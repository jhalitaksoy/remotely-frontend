import { Button, Card, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


export default function SurveyList(props) {

    const [value, setValue] = React.useState(undefined)

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    return (
        <div style={{
            alignSelf: 'stretch',
        }}>
            {
                props.surveys.map((survey) => {
                    return (
                        <Card style={{
                            alignSelf: 'stretch',
                            display : 'flex',
                            flexDirection : 'column',
                            padding: '10px',
                            margin : '10px'
                        }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">{survey.text}</FormLabel>
                                <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                                    {survey.options.map((option) => {
                                        return (
                                            <FormControlLabel value={option.text} control={<Radio />} label={option.text} />
                                        )
                                    })}
                                </RadioGroup>
                            </FormControl>

                            <Button style={{
                                alignSelf: 'flex-end',
                            }} variant="contained" color="secondary">Send</Button>
                        </Card>
                    )
                })
            }
        </div>
    )
}