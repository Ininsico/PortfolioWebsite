import React from 'react'

const TechnicalArchitecture = () => {
    const architecturePatterns = [
        {
            title: "MICROSERVICES ARCHITECTURE",
            description: "Distributed system design with independent service deployment",
            components: ["API Gateway", "Service Discovery", "Config Server", "Circuit Breaker"],
            diagram: "MonoRepo → API Gateway → [Auth Service, User Service, Product Service, Order Service]",
            tech: ["Docker", "Kubernetes", "Spring Cloud", "Redis"]
        },
        {
            title: "EVENT-DRIVEN DESIGN",
            description: "Real-time data processing with message brokers",
            components: ["Message Broker", "Event Producers", "Event Consumers", "Stream Processing"],
            diagram: "Client → API → Event Publisher → [Kafka/RabbitMQ] → Event Consumers → DB",
            tech: ["Apache Kafka", "WebSocket", "Redis Pub/Sub", "WebHooks"]
        }
    ]

    const databaseSchemas = [
        {
            name: "USER MANAGEMENT",
            type: "MongoDB Collections",
            schema: {
                users: {
                    _id: "ObjectId",
                    email: "string (unique)",
                    profile: "embedded document",
                    preferences: "array",
                    timestamps: "ISO Date"
                },
                sessions: {
                    userId: "ObjectId",
                    token: "string",
                    expiresAt: "Date",
                    deviceInfo: "object"
                }
            },
            indexes: ["email (unique)", "createdAt (TTL)", "sessionToken"],
            performance: "2ms read / 5ms write"
        },
        {
            name: "E-COMMERCE DATA",
            type: "PostgreSQL Relations",
            schema: {
                products: "id, name, price, inventory, category_id",
                orders: "id, user_id, total, status, created_at",
                order_items: "id, order_id, product_id, quantity, price",
                categories: "id, name, parent_id, slug"
            },
            relations: "products ← order_items → orders → users",
            indexes: ["product_category", "order_user_date", "search_vector"],
            performance: "5ms complex queries"
        }
    ]

    const apiArchitecture = [
        {
            service: "AUTH SERVICE",
            endpoints: [
                "POST /api/v1/auth/login → JWT Token",
                "POST /api/v1/auth/register → User Creation",
                "GET /api/v1/auth/verify → Token Validation",
                "POST /api/v1/auth/refresh → Token Refresh"
            ],
            rateLimit: "1000 requests/hour",
            security: "JWT + Refresh Tokens"
        },
        {
            service: "PRODUCT SERVICE",
            endpoints: [
                "GET /api/v1/products → Paginated List",
                "GET /api/v1/products/:id → Single Product",
                "POST /api/v1/products → Create (Admin)",
                "PUT /api/v1/products/:id → Update (Admin)",
                "GET /api/v1/products/search → ElasticSearch"
            ],
            cache: "Redis - 5 minutes",
            performance: "50ms response time"
        },
        {
            service: "ORDER SERVICE",
            endpoints: [
                "POST /api/v1/orders → Create Order",
                "GET /api/v1/orders/:id → Order Details",
                "GET /api/v1/orders/user/:userId → User Orders",
                "PUT /api/v1/orders/:id/status → Update Status"
            ],
            transactions: "Database Transactions",
            events: "Order Created → Notification → Inventory Update"
        }
    ]

    const infrastructure = [
        {
            layer: "LOAD BALANCER",
            provider: "AWS ALB / NGINX",
            config: "Round Robin + Health Checks",
            ssl: "Let's Encrypt / AWS Certificate Manager",
            features: ["SSL Termination", "Path Routing", "IP Whitelisting"]
        },
        {
            layer: "COMPUTE",
            provider: "AWS ECS Fargate / Kubernetes",
            scaling: "Horizontal Pod Autoscaling",
            resources: "CPU: 0.5-2 vCPU, RAM: 1-4GB",
            monitoring: "CloudWatch Metrics + Custom Logs"
        },
        {
            layer: "DATABASE",
            provider: "MongoDB Atlas + AWS RDS PostgreSQL",
            backup: "Automated Daily Backups",
            replication: "3-node replica sets",
            security: "VPC Peering + Encryption at Rest"
        },
        {
            layer: "CACHE & MESSAGE QUEUE",
            provider: "Redis Elasticache + AWS SQS",
            useCases: ["Session Storage", "API Cache", "Event Queue"],
            performance: "Sub-millisecond response times"
        },
        {
            layer: "CDN & STORAGE",
            provider: "AWS CloudFront + S3",
            features: ["Global Distribution", "Image Optimization", "File Uploads"],
            security: "Signed URLs + Bucket Policies"
        }
    ]

    return (
        <div className="min-h-screen bg-black text-white font-didone py-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-didone font-bold mb-6 tracking-tight">
                        TECHNICAL ARCHITECTURE
                    </h1>
                    <p className="text-xl opacity-80 max-w-4xl mx-auto leading-relaxed">
                        SCALABLE SYSTEM DESIGNS, DATABASE SCHEMAS, API ARCHITECTURE, 
                        AND CLOUD INFRASTRUCTURE THAT POWERS ENTERPRISE APPLICATIONS
                    </p>
                </div>

                {/* Architecture Patterns */}
                <section className="mb-20">
                    <h2 className="text-3xl font-didone font-bold mb-12 text-center border-b border-white pb-4">
                        ARCHITECTURE PATTERNS
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {architecturePatterns.map((pattern, index) => (
                            <div 
                                key={index}
                                className="border border-white rounded-2xl p-8 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                            >
                                <h3 className="text-2xl font-didone font-bold mb-4">{pattern.title}</h3>
                                <p className="text-lg opacity-90 mb-6 leading-relaxed">{pattern.description}</p>
                                
                                <div className="mb-6">
                                    <h4 className="font-didone font-bold text-lg mb-3">COMPONENTS</h4>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {pattern.components.map((component, idx) => (
                                            <span key={idx} className="px-3 py-1 border border-white rounded-full text-sm hover:bg-white hover:text-black transition-all duration-300">
                                                {component}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-didone font-bold text-lg mb-3">DATA FLOW</h4>
                                    <div className="bg-black text-white p-4 rounded-lg border border-white font-mono text-sm hover:bg-white hover:text-black transition-all duration-300">
                                        {pattern.diagram}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-didone font-bold text-lg mb-3">TECHNOLOGIES</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {pattern.tech.map((tech, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-all duration-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Database Schemas */}
                <section className="mb-20">
                    <h2 className="text-3xl font-didone font-bold mb-12 text-center border-b border-white pb-4">
                        DATABASE SCHEMAS
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {databaseSchemas.map((db, index) => (
                            <div 
                                key={index}
                                className="border border-white rounded-2xl p-8 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-didone font-bold">{db.name}</h3>
                                    <span className="px-3 py-1 border border-white rounded-full text-sm hover:bg-white hover:text-black transition-all duration-300">
                                        {db.type}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-didone font-bold text-lg mb-3">SCHEMA STRUCTURE</h4>
                                    <div className="bg-black border border-white rounded-lg p-4 font-mono text-sm space-y-2 hover:bg-white hover:text-black transition-all duration-300">
                                        {typeof db.schema === 'object' ? (
                                            Object.entries(db.schema).map(([key, value]) => (
                                                <div key={key} className="flex">
                                                    <span className="text-blue-300 flex-shrink-0">{key}:</span>
                                                    <span className="ml-2 text-green-300">{JSON.stringify(value)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-green-300">{db.schema}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h5 className="font-didone font-bold mb-2">INDEXES</h5>
                                        <div className="space-y-1">
                                            {db.indexes.map((index, idx) => (
                                                <div key={idx} className="opacity-80">• {index}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-didone font-bold mb-2">PERFORMANCE</h5>
                                        <div className="opacity-80">{db.performance}</div>
                                        {db.relations && (
                                            <>
                                                <h5 className="font-didone font-bold mt-3 mb-2">RELATIONS</h5>
                                                <div className="opacity-80">{db.relations}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* API Architecture */}
                <section className="mb-20">
                    <h2 className="text-3xl font-didone font-bold mb-12 text-center border-b border-white pb-4">
                        API ARCHITECTURE
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {apiArchitecture.map((api, index) => (
                            <div 
                                key={index}
                                className="border border-white rounded-2xl p-6 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                            >
                                <h3 className="text-xl font-didone font-bold mb-4">{api.service}</h3>
                                
                                <div className="mb-4">
                                    <h4 className="font-didone font-bold mb-3">ENDPOINTS</h4>
                                    <div className="space-y-2">
                                        {api.endpoints.map((endpoint, idx) => (
                                            <div key={idx} className="font-mono text-sm border border-white p-2 rounded hover:bg-white hover:text-black transition-all duration-300">
                                                {endpoint}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Rate Limit:</span>
                                        <span>{api.rateLimit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-bold">Security:</span>
                                        <span>{api.security}</span>
                                    </div>
                                    {api.cache && (
                                        <div className="flex justify-between">
                                            <span className="font-bold">Cache:</span>
                                            <span>{api.cache}</span>
                                        </div>
                                    )}
                                    {api.performance && (
                                        <div className="flex justify-between">
                                            <span className="font-bold">Performance:</span>
                                            <span>{api.performance}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Infrastructure Setup */}
                <section>
                    <h2 className="text-3xl font-didone font-bold mb-12 text-center border-b border-white pb-4">
                        INFRASTRUCTURE SETUP
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {infrastructure.map((infra, index) => (
                            <div 
                                key={index}
                                className="border border-white rounded-2xl p-6 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                            >
                                <h3 className="text-xl font-didone font-bold mb-3">{infra.layer}</h3>
                                <div className="mb-4">
                                    <span className="px-2 py-1 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-all duration-300">
                                        {infra.provider}
                                    </span>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="font-bold">Configuration:</span>
                                        <div className="opacity-80 mt-1">{infra.config}</div>
                                    </div>
                                    
                                    {infra.scaling && (
                                        <div>
                                            <span className="font-bold">Scaling:</span>
                                            <div className="opacity-80 mt-1">{infra.scaling}</div>
                                        </div>
                                    )}

                                    {infra.resources && (
                                        <div>
                                            <span className="font-bold">Resources:</span>
                                            <div className="opacity-80 mt-1">{infra.resources}</div>
                                        </div>
                                    )}

                                    {infra.features && (
                                        <div>
                                            <span className="font-bold">Features:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {infra.features.map((feature, idx) => (
                                                    <span key={idx} className="px-2 py-1 border border-white rounded text-xs hover:bg-white hover:text-black transition-all duration-300">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default TechnicalArchitecture