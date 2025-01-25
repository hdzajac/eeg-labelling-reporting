import { create } from 'zustand'

import { Report } from '@/components/useReport'

type ReportState = {
  report: Report
  updateReport(report: Report): void
  appendToReport(chunk: string): void
  reset(): void
}

const defaultReport: Report = {
  content: '',
}

export const useReportStore = create<ReportState>((set) => ({
  report: defaultReport,
  updateReport(report: Report) {
    set((state) => ({
      report: report,
    }))
  },
  appendToReport(chunk: string) {
    set((state) => ({
      report: {
        ...state.report,
        content: state.report.content + chunk,
      },
    }))
  },
  reset() {
    set({ report: defaultReport })
  },
}))
