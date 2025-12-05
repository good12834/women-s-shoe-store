import { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const Customizer = () => {
    const [colors, setColors] = useState({
        upper: '#ff0000',
        sole: '#ffffff',
        laces: '#000000'
    });

    const handleColorChange = (part, color) => {
        setColors(prev => ({ ...prev, [part]: color }));
    };

    const colorOptions = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#000000', '#ffffff', '#ff00ff', '#00ffff'];

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">Design Your Own Shoe</h2>

            <Row className="align-items-center">
                <Col md={7}>
                    {/* Shoe Preview Area */}
                    <div
                        className="d-flex justify-content-center align-items-center bg-light rounded border"
                        style={{ height: '400px', position: 'relative' }}
                    >
                        {/* Simplified SVG Representation for Customization */}
                        <svg width="300" height="200" viewBox="0 0 300 200">
                            {/* Sole */}
                            <path
                                d="M20,150 Q150,180 280,150 L280,170 Q150,200 20,170 Z"
                                fill={colors.sole}
                                stroke="#333"
                                strokeWidth="2"
                            />
                            {/* Upper */}
                            <path
                                d="M20,150 Q50,50 150,50 Q250,50 280,150 Z"
                                fill={colors.upper}
                                stroke="#333"
                                strokeWidth="2"
                            />
                            {/* Laces Area */}
                            <rect x="120" y="60" width="60" height="80" fill={colors.laces} />
                        </svg>
                    </div>
                </Col>

                <Col md={5}>
                    <Card className="p-4">
                        <h4 className="mb-3">Customization Options</h4>

                        <div className="mb-4">
                            <h5>Upper Color</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {colorOptions.map(c => (
                                    <div
                                        key={c}
                                        onClick={() => handleColorChange('upper', c)}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: c,
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            border: colors.upper === c ? '3px solid #333' : '1px solid #ccc'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h5>Sole Color</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {colorOptions.map(c => (
                                    <div
                                        key={c}
                                        onClick={() => handleColorChange('sole', c)}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: c,
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            border: colors.sole === c ? '3px solid #333' : '1px solid #ccc'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h5>Laces Color</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {colorOptions.map(c => (
                                    <div
                                        key={c}
                                        onClick={() => handleColorChange('laces', c)}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: c,
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            border: colors.laces === c ? '3px solid #333' : '1px solid #ccc'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button variant="primary" size="lg" className="w-100">Save Design</Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Customizer;
