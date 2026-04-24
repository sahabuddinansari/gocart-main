import { inngest } from './client'

// dynamic prisma
let prisma;

async function getPrisma() {
  if (!prisma) {
    const module = await import('../lib/prisma');
    prisma = module.default;
  }
  return prisma;
}

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const prisma = await getPrisma();
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`,
        image: data.image_url,
      },
    });
  }
);

export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const prisma = await getPrisma();
    const { data } = event;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`,
        image: data.image_url,
      },
    });
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const prisma = await getPrisma();
    const { data } = event;

    await prisma.user.deleteMany({
      where: { id: data.id },
    });
  }
);