import type { divergenciasType } from "../types/types"

export const divergenciasData: divergenciasType[] = [
  {
    id: "DV-1",
    store: "101",
    supplier: "Distribuidora ABC",
    requestDate: new Date("2025-06-10"),
    supplierDocument: "12.345.678/0001-90",
    openDays: 5,
    status: "NOVO",
    produtos: [
      {
        productCode: "A123",
        quantity: 3,
        value: 150.5,
        type: "FALTA",
        entryNote: 1001,
      },
      {
        productCode: "A124",
        quantity: 4,
        value: 154.5,
        type: "SOBRA",
        entryNote: 1001,
      },
    ],
    description:
      "**Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.**",
  },
  {
    id: "DV-2",
    store: "101",
    supplier: "Fornecedor XYZ",
    requestDate: new Date("2025-06-12"),
    supplierDocument: "98.765.432/0001-10",
    openDays: 3,
    status: "RESOLVIDO",
    produtos: [
      {
        productCode: "B456",
        quantity: 1,
        value: 80,
        type: "AVARIA",
        entryNote: 1002,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "DV-3",
    store: "102",
    supplier: "Importadora BR",
    requestDate: new Date("2025-10-06"),
    supplierDocument: "11.222.333/0001-44",
    openDays: 10,
    status: "NOVO",
    produtos: [
      {
        productCode: "C789",
        quantity: 5,
        value: 42.99,
        type: "SOBRA",
        entryNote: 1003,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "DV-4",
    store: "103",
    supplier: "Tech Fornecedora",
    requestDate: new Date("2025-06-08"),
    supplierDocument: "00.111.222/0001-33",
    openDays: 7,
    status: "PENDENTE",
    produtos: [
      {
        productCode: "D321",
        quantity: 2,
        value: 99.99,
        type: "OUTRO",
        entryNote: 1004,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "DV-5",
    store: "104",
    supplier: "Log Distribuição",
    requestDate: new Date("2025-06-03"),
    supplierDocument: "77.888.999/0001-55",
    openDays: 12,
    status: "PENDENTE",
    produtos: [
      {
        productCode: "E654",
        quantity: 10,
        value: 25,
        type: "FALTA",
        entryNote: 1005,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "DV-6",
    store: "101",
    supplier: "Distribuidora ABC",
    requestDate: new Date("2025-06-11"),
    supplierDocument: "12.345.678/0001-90",
    openDays: 4,
    status: "RESOLVIDO",
    produtos: [
      {
        productCode: "F987",
        quantity: 2,
        value: 65.3,
        type: "AVARIA",
        entryNote: 1006,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "DV-7",
    store: "101",
    supplier: "Fornecedor XYZ",
    requestDate: new Date("2025-06-11"),
    supplierDocument: "98.765.432/0001-10",
    openDays: 14,
    status: "NOVO",
    produtos: [
      {
        productCode: "G432",
        quantity: 1,
        value: 310,
        type: "OUTRO",
        entryNote: 1007,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "DV-8",
    store: "102",
    supplier: "Importadora BR",
    requestDate: new Date("2025-06-11"),
    supplierDocument: "11.222.333/0001-44",
    openDays: 1,
    status: "PENDENTE",
    produtos: [
      {
        productCode: "H111",
        quantity: 6,
        value: 12.5,
        type: "FALTA",
        entryNote: 1008,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "DV-9",
    store: "103",
    supplier: "Tech Fornecedora",
    requestDate: new Date("2025-06-11"),
    supplierDocument: "00.111.222/0001-33",
    openDays: 2,
    status: "PENDENTE",
    produtos: [
      {
        productCode: "I222",
        quantity: 3,
        value: 55.75,
        type: "SOBRA",
        entryNote: 1009,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "DV-10",
    store: "104",
    supplier: "Log Distribuição",
    requestDate: new Date("2025-06-11"),
    supplierDocument: "77.888.999/0001-55",
    openDays: 13,
    status: "RESOLVIDO",
    produtos: [
      {
        productCode: "J333",
        quantity: 4,
        value: 40,
        type: "AVARIA",
        entryNote: 1010,
      },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
]
