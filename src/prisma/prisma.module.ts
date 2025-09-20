import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // deixa disponível em toda a aplicação (opcional)
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // exporta para outros módulos poderem usar
})
export class PrismaModule { }
