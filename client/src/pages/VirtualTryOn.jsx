import { useState, useRef } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

const VirtualTryOn = () => {
    const [image, setImage] = useState(null);
    const [shoePosition, setShoePosition] = useState({ x: 50, y: 50, scale: 1, rotation: 0 });
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleControlChange = (e) => {
        const { name, value } = e.target;
        setShoePosition(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">Virtual Try-On</h2>
            <p className="text-center text-muted">Upload a photo of your feet and see how the shoes look!</p>

            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-3 mb-4">
                        <div
                            style={{
                                width: '100%',
                                height: '500px',
                                backgroundColor: '#f8f9fa',
                                position: 'relative',
                                overflow: 'hidden',
                                border: '2px dashed #ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {image ? (
                                <img
                                    src={image}
                                    alt="User Upload"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <div className="text-center">
                                    <Button onClick={() => fileInputRef.current.click()}>Upload Photo</Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            )}

                            {/* Shoe Overlay */}
                            {image && (
                                <img
                                    src="https://placehold.co/150x150/FF0000/FFFFFF?text=Shoe" // Placeholder shoe with transparent bg ideally
                                    alt="Shoe Overlay"
                                    style={{
                                        position: 'absolute',
                                        top: `${shoePosition.y}%`,
                                        left: `${shoePosition.x}%`,
                                        transform: `translate(-50%, -50%) scale(${shoePosition.scale}) rotate(${shoePosition.rotation}deg)`,
                                        width: '150px',
                                        pointerEvents: 'none',
                                        opacity: 0.9
                                    }}
                                />
                            )}
                        </div>
                    </Card>

                    {image && (
                        <Card className="p-3">
                            <h5>Adjust Shoe</h5>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Horizontal Position</Form.Label>
                                            <Form.Range name="x" min="0" max="100" value={shoePosition.x} onChange={handleControlChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Vertical Position</Form.Label>
                                            <Form.Range name="y" min="0" max="100" value={shoePosition.y} onChange={handleControlChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Size (Scale)</Form.Label>
                                            <Form.Range name="scale" min="0.5" max="2" step="0.1" value={shoePosition.scale} onChange={handleControlChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Rotation</Form.Label>
                                            <Form.Range name="rotation" min="-180" max="180" value={shoePosition.rotation} onChange={handleControlChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="text-center mt-3">
                                    <Button variant="outline-secondary" onClick={() => setImage(null)}>Reset Photo</Button>
                                </div>
                            </Form>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default VirtualTryOn;
