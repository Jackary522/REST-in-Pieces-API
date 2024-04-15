# REST in Pieces: An Analysis of Common Vulnerabilities in RESTful APIs

APIs, Application Programming Interfaces, are one of the most important technologies of today’s modern cloud and web applications. Their widespread use as well as their rapid growth have increased the number of security threats posed against them. This project offers an analysis of the most prevalent security vulnerabilities in Representational State Transfer (RESTful) APIs. REST is widely used in APIs due to simplicity and integration with HTTP (Hypertext Transfer Protocol).

This project will cover the structure and principles of RESTful APIs, laying the foundation to understand the context in which these vulnerabilities arise. Following this, the project will introduce the most common security vulnerabilities found in RESTful APIs as reported by the Open Worldwide Application Security Project (OWASP) in 2021.

These include, in the order of commonality, broken access control, with a focus on authentication and authorization, cryptographic failures, also known as sensitive data exposure, injection attacks, specifically SQL injection and cross-site scripting, and finally insecure design. Additionally, each of the security vulnerabilities will be analyzed in conjunction with a specifically developed API endpoint to demonstrate these issues.

This API, written in JavaScript--which is widely used in web applications--and executed with the Node.js runtime, serves as a practical demonstration of the discussed vulnerabilities. The API will be documented within the project and will also be accessible through a dedicated GitHub repository.

By integrating theoretical analysis with practical application, this paper aims to highlight how these vulnerabilities might arise in real-world scenarios, but also offer effective strategies and best practices to mitigate these security risks.
