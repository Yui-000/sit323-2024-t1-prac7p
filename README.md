# Cloud Native Application with MongoDB

This is a cloud-native microservice application that demonstrates the integration of a Node.js application with MongoDB in a Kubernetes environment.

## Features

- RESTful API endpoints for CRUD operations
- MongoDB Atlas integration
- Kubernetes deployment
- Docker containerization
- Health check monitoring
- Performance logging

## Prerequisites

- Git
- Node.js (v18 or higher)
- Docker
- Kubernetes
- kubectl
- MongoDB Atlas account

## Project Structure

```
project/
├── app/
│   ├── index.js          # Main application code
│   ├── package.json      # Node.js dependencies
├── k8s/
│   ├── app-deployment.yaml    # Kubernetes deployment
│   └── mongo-secret.yaml      # MongoDB credentials (not in git)
├── Dockerfile        # Docker configuration
└── README.md
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yui-000/sit323-2024-t1-prac7p
   cd sit323-2024-t1-prac7p
   ```

2. **Set up MongoDB**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Create a database user
   - Get your connection string

3. **Create MongoDB Secret**
   - Create a file `k8s/mongo-secret.yaml` with your MongoDB credentials:
   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mongo-secret
   type: Opaque
   stringData:
     mongo-uri: "your-mongodb-connection-string"
   ```

4. **Build and Push Docker Image**
   ```bash
   docker build -t [your-docker-username]/cloud-db-app:latest ./app
   docker push [your-docker-username]/cloud-db-app:latest
   ```

5. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f k8s/mongo-secret.yaml
   kubectl apply -f k8s/app-deployment.yaml
   ```

## API Endpoints

- `GET /items` - Get all items
- `GET /items/:id` - Get a specific item
- `POST /items` - Create a new item
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item
- `GET /health` - Check application health

## Testing the Application

1. **Create an item**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"test item\"}" http://localhost:80/items
   ```

2. **Get all items**
   ```bash
   curl http://localhost:80/items
   ```

3. **Get a specific item**
   ```bash
   curl http://localhost:80/items/[item-id]
   ```

4. **Update an item**
   ```bash
   curl -X PUT -H "Content-Type: application/json" -d "{\"name\":\"updated item\"}" http://localhost:80/items/[item-id]
   ```

5. **Delete an item**
   ```bash
   curl -X DELETE http://localhost:80/items/[item-id]
   ```

6. **Check health**
   ```bash
   curl http://localhost:80/health
   ```

## Monitoring

- View application logs:
  ```bash
  kubectl logs -f deployment/cloud-db-app
  ```

- Check pod status:
  ```bash
  kubectl get pods
  ```

- Check service status:
  ```bash
  kubectl get svc
  ```

## Security Considerations

- MongoDB credentials are stored as Kubernetes secrets
- The application uses environment variables for configuration
- Sensitive files are excluded from git using .gitignore

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 