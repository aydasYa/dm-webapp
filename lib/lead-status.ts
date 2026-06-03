export const STATUS_LABELS: Record<string, string> = {
  NEW:               "Neu",
  DISTRIBUTED:       "Verteilt",
  QR_SCANNED:        "QR gescannt",
  WORKSHOP_SELECTED: "Werkstatt gewählt",
  IN_REPAIR:         "In Reparatur",
  REPAIR_DONE:       "Reparatur fertig",
  VEHICLE_DELIVERED: "Fahrzeug übergeben",
  COMPLETED:         "Abgeschlossen",
  CANCELLED:         "Storniert",
}

export const STATUS_STYLES: Record<string, string> = {
  NEW:               "bg-violet-100 text-violet-700",
  DISTRIBUTED:       "bg-blue-100 text-blue-700",
  QR_SCANNED:        "bg-cyan-100 text-cyan-700",
  WORKSHOP_SELECTED: "bg-indigo-100 text-indigo-700",
  IN_REPAIR:         "bg-yellow-100 text-yellow-700",
  REPAIR_DONE:       "bg-orange-100 text-orange-700",
  VEHICLE_DELIVERED: "bg-teal-100 text-teal-700",
  COMPLETED:         "bg-emerald-100 text-emerald-800",
  CANCELLED:         "bg-red-100 text-red-700",
}
