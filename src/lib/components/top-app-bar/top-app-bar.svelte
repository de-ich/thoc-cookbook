<header id="app-bar">
	<div class="flex w-full flex-col items-center">
		<div class="flex h-16 w-full flex-row items-center p-3 xl:max-w-(--breakpoint-xl)">
			<slot />
		</div>
		<div
			class="h-2 w-full bg-primary xl:max-w-(--breakpoint-2xl) bg-linear-to-r from-background via-primary to-background"
		></div>
	</div>
</header>
