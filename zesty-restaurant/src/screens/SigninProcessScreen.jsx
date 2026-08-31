import React, { useEffect, useState } from 'react'
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import "../assets/css/signinProcess.css"
import { Box, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import RestaurantInformationForm from './SigninProcess/RestaurantInformationForm';
import RestaurantDocumentsForm from './SigninProcess/RestaurantDocumentsForm';
import MenuSetup from './SigninProcess/MenuSetup';
import PartnerContract from './SigninProcess/PartnerContract';

export default function SigninProcessScreen() {

    const [activeStep, setActiveStep] = useState(0);
    const [user, setUser] = useState(null);

    const handleNext = (data) => {
        setUser({ ...user, ...data });
        setActiveStep(activeStep + 1);
    };

    const handleBack = (data) => {
        setUser({ ...user, ...data });
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const steps = [
        {
            label: 'STEP 1',
            title: "Restaurant Information",
            description: `Location, Owner details, Open & close hrs.`,
        },
        {
            label: 'STEP 2',
            title: 'Restaurant Documents',
            description: "FSSAI, PAN, GST and Bank account."
        },
        {
            label: 'STEP 3',
            title: "Menu Setup",
            description: "Menu Image Details."
        },
        {
            label: "STEP 4",
            title: "Partner Contract",
            description: "Commision details, other charges and TC."
        }
    ];

    return (
        <div style={{ backgroundColor: "#faf7f7" }}>
            <Navbar className="bg-body-tertiary navbar">
                <Container>
                    <Navbar.Brand style={window.innerWidth > 600 ? { fontSize: "25px", marginTop: "50px" } : {marginTop: "50px"}}>
                        <img
                            alt=""
                            src=".\images\zesty-without-bg-black.png"
                            className="img-logo d-inline-block align-top"
                        />{' '}
                        <strong style={{ marginLeft: "-40px" }}>Zesty</strong> for restaurants
                    </Navbar.Brand>
                </Container>
            </Navbar>


            <Container style={window.innerWidth >= 600 ? { marginTop: "50px", padding: "0 0 0 200px" } : {}}>
                <Row>
                    <Col md={3} style={{ marginTop: "50px" }}>
                        <Box>
                            {
                                window.innerWidth <= 600 ?
                                    <Stepper activeStep={activeStep} alternativeLabe sx={{
                                        '& .MuiStepIcon-root.Mui-active': {
                                            color: 'black', // Change the color of the active step icon
                                        },
                                        '& .MuiStepIcon-root.Mui-completed': {
                                            color: 'black', // Change the color of the completed step icon
                                        },
                                    }} l>
                                        {steps.map((label) => (
                                            <Step key={label.label}>
                                                <StepLabel>{label.label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    :
                                    <Stepper activeStep={activeStep} orientation='vertical' style={{ position: "fixed", width: "250px" }} sx={{
                                        '& .MuiStepIcon-root.Mui-active': {
                                            color: 'black', // Change the color of the active step icon
                                        },
                                        '& .MuiStepIcon-root.Mui-completed': {
                                            color: 'black', // Change the color of the completed step icon
                                        },
                                    }}>
                                        {steps.map((step, index) => (
                                            <Step key={step.label} style={{ color: "red" }}>
                                                <StepLabel>
                                                    <h6 style={{ marginLeft: "20px" }}><strong>{step.title}</strong></h6>
                                                </StepLabel>

                                                <StepContent>
                                                    <p style={{ color: "#aaa", marginLeft: "20px" }}>{step.description}</p>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>
                            }
                        </Box>
                    </Col>
                    <Col style={window.innerWidth > 600 ? { marginLeft: "20px" } : {}}>
                        {activeStep === 0 && (<RestaurantInformationForm onNext={handleNext} />)}
                        {activeStep === 1 && (<RestaurantDocumentsForm onNext={handleNext} onBack={handleBack} />)}
                        {activeStep === 2 && (<MenuSetup onNext={handleNext} onBack={handleBack} />)}
                        {activeStep === 3 && (<PartnerContract onNext={handleNext} onBack={handleBack} />)}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
