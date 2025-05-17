import fire  # type: ignore

from nova_act import NovaAct


def main(record_video: bool = False) -> None:
    with NovaAct(
        starting_page="https://www.google.com",
        record_video=record_video,
    ) as nova:
        nova.act("navigate to turbotax")
        nova.act("go to the about page")
        nova.act("scroll until you reach the bottom")


if __name__ == "__main__":
    fire.Fire(main)
