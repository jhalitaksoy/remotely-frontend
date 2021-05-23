import { Button, Card } from '@material-ui/core';
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { voteSurvey } from '../controller/ChatController';

export default function SurveyList(props) {
    return (
        <div style={{
            alignSelf: 'stretch',
        }}>
            {
                props.surveys &&
                props.surveys.map((survey) => <Survey key={survey.ID} survey={survey} />)
            }
        </div>
    )
}

function Survey(props) {
    const { survey } = props

    const [value, setValue] = React.useState(undefined)

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const onVoteClick = (e) => {
        for (const option of survey.options) {
            if (option.text === value) {
                voteSurvey(survey.ID, option.id)
                return;
            }
        }
    }

    let vote;

    if (survey && survey.votes) {
        vote = survey.votes[window.currentUser().id]
    }

    return (
        <Card style={{
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            margin: '10px'
        }}>
            <FormControl component="fieldset">
                <FormLabel component="legend">{survey.text}</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                    {survey.options.map((option) => {
                        return (
                            <div
                                style={{
                                    display : 'flex',
                                    alignSelf : 'stretch',
                                    alignItems: 'center'
                                }}
                            >
                                <FormControlLabel disabled={vote} value={option.text} control={<Radio />} label={option.text} />
                                {vote && <FormLabel  style={{
                                    marginLeft : 'auto',
                                    marginRight : '30px'
                                }} component="legend">{option.count * 100 / survey.participantCount}%</FormLabel>}
                            </div>
                        )
                    })}
                </RadioGroup>
            </FormControl>

            <Button
                disabled={vote}
                onClick={onVoteClick}
                style={{
                    alignSelf: 'flex-end',
                }} variant="contained" color="secondary">Vote</Button>
        </Card>
    )
}