"use client";

import type { ReactNode } from "react";
import type { AbstractIntlMessages } from "use-intl";
import { StyleProvider } from "@ant-design/cssinjs";
import { NextIntlClientProvider } from "next-intl";
import { ConfigProvider } from "antd";
import { QueryProvider } from "@/components/QueryProvider";

export function Providers({
	children,
	locale,
	messages,
	timeZone,
}: {
	children: ReactNode;
	locale: string;
	messages: AbstractIntlMessages;
	timeZone: string;
}) {
	return (
		<QueryProvider>
			<StyleProvider layer>
				<ConfigProvider>
					<NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
						{children}
					</NextIntlClientProvider>
				</ConfigProvider>
			</StyleProvider>
		</QueryProvider>
	);
}
