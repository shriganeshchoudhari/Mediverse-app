output "vpc_id" { value = aws_vpc.main.id }
output "private_subnet_ids" { value = aws_subnet.private[*].id }
output "secure_subnet_ids" { value = aws_subnet.secure[*].id }
output "public_subnet_ids" { value = aws_subnet.public[*].id }
