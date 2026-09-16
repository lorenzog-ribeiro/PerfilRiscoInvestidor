import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.result.findFirst();

  if (result && result.answers) {
    const answers = result.answers as any;
    console.log('=== Estrutura dos tradeoffs ===');
    if (answers.tradeoffs && answers.tradeoffs.length > 0) {
      console.log(
        'Primeiro tradeoff:',
        JSON.stringify(answers.tradeoffs[0], null, 2),
      );
      console.log('\nTotal de tradeoffs:', answers.tradeoffs.length);

      // Mostrar alguns exemplos
      console.log('\n=== Exemplos por cenário ===');
      [1, 2, 3].forEach((scenario) => {
        const items = answers.tradeoffs.filter((t) => t.scenario === scenario);
        console.log(`\nCenário ${scenario} (${items.length} itens):`);
        items.slice(0, 2).forEach((item) => {
          console.log(JSON.stringify(item, null, 2));
        });
      });
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
