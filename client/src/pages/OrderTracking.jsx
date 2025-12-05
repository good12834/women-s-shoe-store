import { useState } from 'react';
import { Container, Form, Button, Card, ProgressBar } from 'react-bootstrap';

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [trackingData, setTrackingData] = useState(null);

    const handleTrack = (e) => {
        e.preventDefault();
        // Mock data
        setTrackingData([
            { status: 'pending', description: 'Order placed', created_at: '2023-10-27 10:00' },
            { status: 'processing', description: 'Payment confirmed', created_at: '2023-10-27 10:05' },
            { status: 'shipped', description: 'Shipped via FedEx', created_at: '2023-10-28 09:00' }
        ]);
    };

    const getProgress = () => {
        if (!trackingData) return 0;
        const lastStatus = trackingData[trackingData.length - 1].status;
        switch (lastStatus) {
            case 'pending': return 25;
            case 'processing': return 50;
            case 'shipped': return 75;
            case 'delivered': return 100;
            default: return 0;
        }
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">Track Your Order</h2>
            <div className="d-flex justify-content-center mb-5">
                <Form onSubmit={handleTrack} className="d-flex gap-2">
                    <Form.Control
                        type="text"
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                    <Button type="submit">Track</Button>
                </Form>
            </div>

            {trackingData && (
                <Card className="p-4">
                    <h4 className="mb-3">Order Status</h4>
                    <ProgressBar now={getProgress()} label={`${getProgress()}%`} className="mb-4" variant="success" />

                    <div className="timeline">
                        {trackingData.map((event, idx) => (
                            <div key={idx} className="mb-3 border-start border-3 ps-3 border-primary">
                                <h5>{event.status.toUpperCase()}</h5>
                                <p className="mb-0">{event.description}</p>
                                <small className="text-muted">{event.created_at}</small>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </Container>
    );
};

export default OrderTracking;
